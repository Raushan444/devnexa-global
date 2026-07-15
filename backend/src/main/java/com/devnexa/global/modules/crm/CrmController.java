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
public class CrmController {

    @Autowired
    private LeadService leadService;

    @Autowired
    private AuditService auditService;

    // -------------------------------------------------------------------------
    // Admin endpoints
    // -------------------------------------------------------------------------

    @GetMapping("/api/admin/crm/leads")
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

    @PostMapping("/api/admin/crm/leads")
    public ResponseEntity<?> createLead(@RequestBody Lead lead,
                                         @AuthenticationPrincipal UserPrincipal actor) {
        Lead saved = leadService.createLead(lead);
        auditService.log(actor.getUsername(), "CREATE", "Lead", saved.getId().toString(), "Lead created: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/api/admin/crm/leads/{id}")
    public ResponseEntity<?> updateLead(@PathVariable Long id, @RequestBody Lead updates,
                                         @AuthenticationPrincipal UserPrincipal actor) {
        Lead updated = leadService.updateLead(id, updates);
        auditService.log(actor.getUsername(), "UPDATE", "Lead", id.toString(), "Lead updated: status=" + updated.getStatus());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/api/admin/crm/leads/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id,
                                         @AuthenticationPrincipal UserPrincipal actor) {
        leadService.deleteLead(id);
        auditService.log(actor.getUsername(), "DELETE", "Lead", id.toString(), "Lead deleted");
        return ResponseEntity.ok(new ApiResponse(true, "Lead deleted successfully."));
    }

    // -------------------------------------------------------------------------
    // Public endpoints
    // -------------------------------------------------------------------------

    /**
     * POST /api/public/crm/project-planner
     * Saves a lead generated from the Project Planner wizard.
     */
    @PostMapping("/api/public/crm/project-planner")
    public ResponseEntity<Lead> createFromProjectPlanner(@RequestBody ProjectPlannerRequest req) {
        Lead lead = new Lead();
        lead.setName(req.name());
        lead.setEmail(req.email());
        lead.setCompany(req.company());
        lead.setPhone(req.phone());
        lead.setSource(Lead.LeadSource.PLANNER);
        lead.setNotes(buildPlannerNotes(req));
        Lead saved = leadService.createLead(lead);
        return ResponseEntity.ok(saved);
    }

    /**
     * POST /api/public/crm/quote-request
     * Saves a lead generated from the Quote Request form.
     */
    @PostMapping("/api/public/crm/quote-request")
    public ResponseEntity<Lead> createFromQuoteRequest(@RequestBody QuoteRequestBody req) {
        Lead lead = new Lead();
        lead.setName(req.name());
        lead.setEmail(req.email());
        lead.setCompany(req.company());
        lead.setPhone(req.phone());
        lead.setSource(Lead.LeadSource.QUOTE);
        lead.setNotes(buildQuoteNotes(req));
        Lead saved = leadService.createLead(lead);
        return ResponseEntity.ok(saved);
    }

    // -------------------------------------------------------------------------
    // DTOs
    // -------------------------------------------------------------------------

    public record ProjectPlannerRequest(
            String name,
            String email,
            String company,
            String phone,
            String businessType,
            String projectGoal,
            List<String> features,
            String designStyle,
            String budget,
            String timeline,
            String notes
    ) {}

    public record QuoteRequestBody(
            String name,
            String email,
            String company,
            String phone,
            String projectName,
            String projectType,
            String budget,
            String timeline,
            String description,
            String figmaLink,
            String xdLink,
            String liveSiteUrl,
            List<String> uploadedFileUrls
    ) {}

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private String buildPlannerNotes(ProjectPlannerRequest req) {
        StringBuilder sb = new StringBuilder();
        if (req.businessType() != null) sb.append("Business Type: ").append(req.businessType()).append("\n");
        if (req.projectGoal() != null) sb.append("Goal: ").append(req.projectGoal()).append("\n");
        if (req.features() != null && !req.features().isEmpty())
            sb.append("Features: ").append(String.join(", ", req.features())).append("\n");
        if (req.designStyle() != null) sb.append("Design Style: ").append(req.designStyle()).append("\n");
        if (req.budget() != null) sb.append("Budget: ").append(req.budget()).append("\n");
        if (req.timeline() != null) sb.append("Timeline: ").append(req.timeline()).append("\n");
        if (req.notes() != null) sb.append("Notes: ").append(req.notes()).append("\n");
        return sb.toString().trim();
    }

    private String buildQuoteNotes(QuoteRequestBody req) {
        StringBuilder sb = new StringBuilder();
        if (req.projectName() != null) sb.append("Project: ").append(req.projectName()).append("\n");
        if (req.projectType() != null) sb.append("Type: ").append(req.projectType()).append("\n");
        if (req.budget() != null) sb.append("Budget: ").append(req.budget()).append("\n");
        if (req.timeline() != null) sb.append("Timeline: ").append(req.timeline()).append("\n");
        if (req.description() != null) sb.append("Description: ").append(req.description()).append("\n");
        if (req.figmaLink() != null) sb.append("Figma: ").append(req.figmaLink()).append("\n");
        if (req.xdLink() != null) sb.append("XD: ").append(req.xdLink()).append("\n");
        if (req.liveSiteUrl() != null) sb.append("Live Site: ").append(req.liveSiteUrl()).append("\n");
        if (req.uploadedFileUrls() != null && !req.uploadedFileUrls().isEmpty())
            sb.append("Files: ").append(String.join(", ", req.uploadedFileUrls())).append("\n");
        return sb.toString().trim();
    }
}
