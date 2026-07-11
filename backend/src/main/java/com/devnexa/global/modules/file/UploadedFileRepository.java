package com.devnexa.global.modules.file;

import com.devnexa.global.modules.file.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
    List<UploadedFile> findByProjectId(Long projectId);
    Optional<UploadedFile> findByFilename(String filename);
}
