package com.devnexa.global.modules.file;

import com.devnexa.global.modules.portal.Project;
import com.devnexa.global.modules.file.UploadedFile;
import com.devnexa.global.modules.auth.User;
import com.devnexa.global.modules.file.UploadedFileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${app.file.storage-path:./uploads}")
    private String storagePath;

    @Autowired
    private UploadedFileRepository uploadedFileRepository;

    @Autowired
    private IFileStorageService fileStorage;

    private Path getStorageDir() {
        return Paths.get(storagePath).toAbsolutePath().normalize();
    }

    public UploadedFile storeFile(MultipartFile file, User uploadedBy, Project project) throws IOException {
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        
        // Upload via active file storage provider
        FileUploadResult result = fileStorage.upload(file.getBytes(), originalFilename, file.getContentType());

        // We save the URL/secure URL as the filename to support rendering in frontend directly
        String displayUrl = result.secureUrl() != null && !result.secureUrl().isBlank() 
                ? result.secureUrl() 
                : result.url();

        UploadedFile uploadedFile = new UploadedFile(
                displayUrl,
                originalFilename,
                file.getContentType(),
                file.getSize(),
                result.publicId(),
                uploadedBy,
                project
        );
        return uploadedFileRepository.save(uploadedFile);
    }

    public Resource loadFileAsResource(String filename) throws MalformedURLException {
        // If filename is actually a full URL (e.g. Cloudinary secure url), load it as resource or throw
        if (filename.startsWith("http://") || filename.startsWith("https://")) {
            return new UrlResource(filename);
        }
        Path filePath = getStorageDir().resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists()) {
            return resource;
        }
        throw new RuntimeException("File not found: " + filename);
    }

    public List<UploadedFile> getFilesForProject(Long projectId) {
        return uploadedFileRepository.findByProjectId(projectId);
    }

    public void deleteFile(Long fileId) {
        uploadedFileRepository.findById(fileId).ifPresent(f -> {
            try {
                fileStorage.delete(f.getStorageKey());
            } catch (Exception e) {
                logger.warn("Could not delete file from cloud storage: {}", e.getMessage());
            }
            uploadedFileRepository.delete(f);
        });
    }
}
