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

    private Path getStorageDir() {
        return Paths.get(storagePath).toAbsolutePath().normalize();
    }

    public UploadedFile storeFile(MultipartFile file, User uploadedBy, Project project) throws IOException {
        Path storageDir = getStorageDir();
        Files.createDirectories(storageDir);

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        }
        String storedFilename = UUID.randomUUID().toString() + extension;

        Path targetPath = storageDir.resolve(storedFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        UploadedFile uploadedFile = new UploadedFile(
                storedFilename,
                originalFilename,
                file.getContentType(),
                file.getSize(),
                storedFilename,
                uploadedBy,
                project
        );
        return uploadedFileRepository.save(uploadedFile);
    }

    public Resource loadFileAsResource(String filename) throws MalformedURLException {
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
                Path filePath = getStorageDir().resolve(f.getFilename()).normalize();
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                logger.warn("Could not delete file from disk: {}", e.getMessage());
            }
            uploadedFileRepository.delete(f);
        });
    }
}
