package com.devnexa.global.modules.file;

import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.portal.Project;
import com.devnexa.global.modules.file.UploadedFile;
import com.devnexa.global.modules.auth.User;
import com.devnexa.global.modules.portal.ProjectRepository;
import com.devnexa.global.modules.auth.UserRepository;
import com.devnexa.global.modules.auth.UserPrincipal;
import com.devnexa.global.modules.file.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/portal/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("projectId") Long projectId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UploadedFile uploadedFile = fileStorageService.storeFile(file, user, project);
            return ResponseEntity.ok(uploadedFile);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "File upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<UploadedFile>> getProjectFiles(@PathVariable Long projectId) {
        return ResponseEntity.ok(fileStorageService.getFilesForProject(projectId));
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(filename);
            String contentType = "application/octet-stream";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId) {
        fileStorageService.deleteFile(fileId);
        return ResponseEntity.ok(new ApiResponse(true, "File deleted successfully."));
    }
}
