package com.devnexa.global.modules.admin;

import com.devnexa.global.modules.admin.AuditLog;
import com.devnexa.global.modules.admin.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String actorUsername, String action, String targetEntity, String targetId, String details, String ipAddress) {
        AuditLog log = new AuditLog(actorUsername, action, targetEntity, targetId, details, ipAddress);
        auditLogRepository.save(log);
    }

    public void log(String actorUsername, String action, String targetEntity, String targetId, String details) {
        log(actorUsername, action, targetEntity, targetId, details, "unknown");
    }
}
