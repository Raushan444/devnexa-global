package com.devnexa.global.modules.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Default (local disk) implementation of {@link IFileStorageService}.
 * <p>
 * Used when {@code app.file.provider} is not set to {@code cloudinary} (or any other
 * cloud provider).  Files are persisted under the directory configured by
 * {@code app.file.storage-path} (defaults to {@code ./uploads}).
 * </p>
 */
@Service
public class LocalIFileStorageService implements IFileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(LocalIFileStorageService.class);

    @Value("${app.file.storage-path:./uploads}")
    private String storagePath;

    @Override
    public FileUploadResult upload(byte[] data, String originalFilename, String contentType) {
        try {
            Path storageDir = Paths.get(storagePath).toAbsolutePath().normalize();
            Files.createDirectories(storageDir);

            // Determine extension from original filename
            String extension = "";
            if (originalFilename != null) {
                int dot = originalFilename.lastIndexOf('.');
                if (dot > 0) {
                    extension = originalFilename.substring(dot); // e.g. ".png"
                }
            }

            String publicId       = UUID.randomUUID().toString();
            String storedFilename = publicId + extension;
            Path   targetPath     = storageDir.resolve(storedFilename);

            Files.write(targetPath, data);

            String url = "/uploads/" + storedFilename;
            String format = extension.isEmpty() ? "" : extension.substring(1); // strip leading dot

            logger.info("File stored locally: path={}, size={}", targetPath, data.length);
            return new FileUploadResult(publicId, url, url, format, data.length);
        } catch (IOException e) {
            throw new RuntimeException("Local file storage failed: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(String publicId) {
        try {
            Path storageDir = Paths.get(storagePath).toAbsolutePath().normalize();
            // Attempt to delete any file whose name starts with the publicId
            if (Files.exists(storageDir)) {
                Files.list(storageDir)
                        .filter(p -> p.getFileName().toString().startsWith(publicId))
                        .forEach(p -> {
                            try {
                                Files.deleteIfExists(p);
                                logger.info("Local file deleted: {}", p);
                            } catch (IOException e) {
                                logger.warn("Could not delete local file {}: {}", p, e.getMessage());
                            }
                        });
            }
        } catch (IOException e) {
            logger.warn("Error during local file deletion for publicId={}: {}", publicId, e.getMessage());
        }
    }

    @Override
    public String getUrl(String publicId) {
        // Try to resolve with any extension present in the storage directory
        Path storageDir = Paths.get(storagePath).toAbsolutePath().normalize();
        try {
            if (Files.exists(storageDir)) {
                return Files.list(storageDir)
                        .filter(p -> p.getFileName().toString().startsWith(publicId))
                        .findFirst()
                        .map(p -> "/uploads/" + p.getFileName().toString())
                        .orElse("/uploads/" + publicId);
            }
        } catch (IOException e) {
            logger.warn("Could not resolve URL for publicId={}: {}", publicId, e.getMessage());
        }
        return "/uploads/" + publicId;
    }
}
