package com.devnexa.global.modules.file;

/**
 * Abstraction for file storage backends (Cloudinary, local disk, S3, etc.).
 * Implementations are selected via the {@code app.file.provider} property.
 */
public interface IFileStorageService {

    /**
     * Upload raw bytes to the storage backend.
     *
     * @param data             the file bytes
     * @param originalFilename original client-supplied filename (used for extension/format hints)
     * @param contentType      MIME type of the file
     * @return a {@link FileUploadResult} containing the public ID and URLs
     */
    FileUploadResult upload(byte[] data, String originalFilename, String contentType);

    /**
     * Delete a file from the storage backend by its public ID.
     *
     * @param publicId the provider-specific identifier of the file
     */
    void delete(String publicId);

    /**
     * Resolve the public (HTTP) URL for a given public ID.
     *
     * @param publicId the provider-specific identifier of the file
     * @return the fully-qualified URL string
     */
    String getUrl(String publicId);
}
