package com.devnexa.global.modules.admin;

import com.devnexa.global.modules.admin.AuditLog;
import com.devnexa.global.modules.admin.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AuditController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String actor) {
        Pageable pageable = PageRequest.of(page, size);
        if (actor != null && !actor.isEmpty()) {
            return ResponseEntity.ok(auditLogRepository.findByActorUsernameOrderByCreatedAtDesc(actor, pageable));
        }
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByCreatedAtDesc(pageable));
    }
}
