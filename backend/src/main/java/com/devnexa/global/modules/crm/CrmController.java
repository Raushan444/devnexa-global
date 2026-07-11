package com.devnexa.global.modules.crm;

import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.crm.Lead;
import com.devnexa.global.modules.admin.AuditService;
import com.devnexa.global.modules.crm.LeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.devnexa.global.modules.auth.UserPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/crm")
public class CrmController {

    @Autowired
    private LeadService leadService;

    @Autowired
    private AuditService auditService;

    @GetMapping("/leads")
    public ResponseEntity<List<Lead>> getAllLeads(@RequestParam(required = false) String status) {
        if (status != null) {
            try {
                Lead.LeadStatus s = Lead.LeadStatus.valueOf(status.toUpperCase());
                return ResponseEntity.ok(leadService.getLeadsByStatus(s));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.ok(leadService.getAllLeads());
            }
        }
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @PostMapping("/leads")
    public ResponseEntity<?> createLead(@RequestBody Lead lead,
                                         @AuthenticationPrincipal UserPrincipal actor) {
        Lead saved = leadService.createLead(lead);
        auditService.log(actor.getUsername(), "CREATE", "Lead", saved.getId().toString(), "Lead created: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/leads/{id}")
    public ResponseEntity<?> updateLead(@PathVariable Long id, @RequestBody Lead updates,
                                         @AuthenticationPrincipal UserPrincipal actor) {
        Lead updated = leadService.updateLead(id, updates);
        auditService.log(actor.getUsername(), "UPDATE", "Lead", id.toString(), "Lead updated: status=" + updated.getStatus());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/leads/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id,
                                         @AuthenticationPrincipal UserPrincipal actor) {
        leadService.deleteLead(id);
        auditService.log(actor.getUsername(), "DELETE", "Lead", id.toString(), "Lead deleted");
        return ResponseEntity.ok(new ApiResponse(true, "Lead deleted successfully."));
    }
}
