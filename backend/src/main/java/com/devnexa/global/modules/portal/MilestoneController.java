package com.devnexa.global.modules.portal;

import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.portal.Milestone;
import com.devnexa.global.modules.portal.MilestoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portal/projects/{projectId}/milestones")
public class MilestoneController {

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public ResponseEntity<List<Milestone>> getMilestones(@PathVariable Long projectId) {
        return ResponseEntity.ok(milestoneRepository.findByProjectIdOrderByDisplayOrderAsc(projectId));
    }

    @PostMapping
    public ResponseEntity<?> createMilestone(@PathVariable Long projectId, @RequestBody Map<String, Object> payload) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        String title = (String) payload.get("title");
        String description = (String) payload.get("description");
        int order = payload.containsKey("displayOrder") ? (int) payload.get("displayOrder") : 0;

        Milestone milestone = new Milestone(title, description, LocalDate.now().plusDays(14), project, order);
        return ResponseEntity.ok(milestoneRepository.save(milestone));
    }

    @PutMapping("/{milestoneId}")
    public ResponseEntity<?> updateMilestone(@PathVariable Long projectId, @PathVariable Long milestoneId,
                                              @RequestBody Map<String, Object> payload) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        if (payload.containsKey("completed")) milestone.setCompleted((Boolean) payload.get("completed"));
        if (payload.containsKey("title")) milestone.setTitle((String) payload.get("title"));
        if (payload.containsKey("description")) milestone.setDescription((String) payload.get("description"));

        return ResponseEntity.ok(milestoneRepository.save(milestone));
    }

    @DeleteMapping("/{milestoneId}")
    public ResponseEntity<?> deleteMilestone(@PathVariable Long projectId, @PathVariable Long milestoneId) {
        milestoneRepository.deleteById(milestoneId);
        return ResponseEntity.ok(new ApiResponse(true, "Milestone deleted."));
    }
}
