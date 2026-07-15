package com.devnexa.global.modules.file;

/**
 * Represents the result of a file upload operation from any storage backend.
 */
public record FileUploadResult(
        String publicId,
        String url,
        String secureUrl,
        String format,
        long size
) {}
