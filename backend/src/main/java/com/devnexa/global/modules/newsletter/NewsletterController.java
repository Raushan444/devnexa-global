package com.devnexa.global.modules.newsletter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for the newsletter module.
 * Public endpoints: /api/public/newsletter/**
 * Admin endpoints:  /api/admin/newsletter/**
 */
@RestController
@RequestMapping("/api")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    // -------------------------------------------------------------------------
    // Public endpoints
    // -------------------------------------------------------------------------

    /**
     * POST /api/public/newsletter/subscribe
     * Body: { "email": "...", "name": "..." }
     */
    @PostMapping("/public/newsletter/subscribe")
    public ResponseEntity<NewsletterSubscriber> subscribe(@RequestBody SubscribeRequest request) {
        NewsletterSubscriber subscriber = newsletterService.subscribe(request.email(), request.name());
        return ResponseEntity.ok(subscriber);
    }

    // -------------------------------------------------------------------------
    // Admin endpoints
    // -------------------------------------------------------------------------

    /**
     * GET /api/admin/newsletter/subscribers
     * Returns all subscribers (admin only).
     */
    @GetMapping("/admin/newsletter/subscribers")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<NewsletterSubscriber>> getAllSubscribers() {
        return ResponseEntity.ok(newsletterService.getAllSubscribers());
    }

    /**
     * GET /api/admin/newsletter/subscribers/export
     * Returns all confirmed subscribers as a CSV file (admin only).
     */
    @GetMapping("/admin/newsletter/subscribers/export")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> exportSubscribers() {
        String csv = newsletterService.exportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"subscribers.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    /**
     * DELETE /api/admin/newsletter/subscribers/{id}
     * Deletes a subscriber (admin only).
     */
    @DeleteMapping("/admin/newsletter/subscribers/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteSubscriber(@PathVariable Long id) {
        newsletterService.deleteSubscriber(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Subscriber deleted successfully."));
    }

    // -------------------------------------------------------------------------
    // DTOs
    // -------------------------------------------------------------------------

    public record SubscribeRequest(String email, String name) {}
}
