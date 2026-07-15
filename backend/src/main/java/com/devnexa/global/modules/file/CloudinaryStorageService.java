package com.devnexa.global.modules.file;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

/**
 * Cloudinary-backed implementation of {@link IFileStorageService}.
 * <p>
 * Activated when {@code app.file.provider=cloudinary} and the {@code CLOUDINARY_URL}
 * environment variable / property is set.  Decorated with {@code @Primary} so it takes
 * precedence over the local fallback when both beans are present in the context.
 * </p>
 */
@Service
@Primary
@ConditionalOnProperty(name = "app.file.provider", havingValue = "cloudinary")
public class CloudinaryStorageService implements IFileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryStorageService.class);

    private final Cloudinary cloudinary;

    public CloudinaryStorageService(@Value("${CLOUDINARY_URL:}") String cloudinaryUrl) {
        if (cloudinaryUrl == null || cloudinaryUrl.isBlank()) {
            logger.warn("CLOUDINARY_URL is not configured. Cloudinary uploads will fail at runtime.");
            this.cloudinary = null;
        } else {
            this.cloudinary = new Cloudinary(cloudinaryUrl);
        }
    }

    @Override
    public FileUploadResult upload(byte[] data, String originalFilename, String contentType) {
        assertConfigured();
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(data, ObjectUtils.emptyMap());

            String publicId  = (String) result.get("public_id");
            String url       = (String) result.get("url");
            String secureUrl = (String) result.get("secure_url");
            String format    = (String) result.get("format");
            long   size      = result.get("bytes") instanceof Number n ? n.longValue() : 0L;

            logger.info("File uploaded to Cloudinary: publicId={}, size={}", publicId, size);
            return new FileUploadResult(publicId, url, secureUrl, format, size);
        } catch (IOException e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(String publicId) {
        assertConfigured();
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            logger.info("File deleted from Cloudinary: publicId={}", publicId);
        } catch (IOException e) {
            throw new RuntimeException("Cloudinary delete failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String getUrl(String publicId) {
        assertConfigured();
        return cloudinary.url().generate(publicId);
    }

    // -------------------------------------------------------------------------

    private void assertConfigured() {
        if (cloudinary == null) {
            throw new UnsupportedOperationException(
                    "Cloudinary is not configured. Set the CLOUDINARY_URL environment variable.");
        }
    }
}
