package com.devnexa.global.modules.ai;

import com.devnexa.global.modules.crm.Lead;
import com.devnexa.global.modules.auth.User;
import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.portal.Project;
import com.devnexa.global.modules.portal.ProjectRepository;
import com.devnexa.global.modules.ai.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AiController {

    @Autowired
    private AiService aiService;

    @Autowired
    private ProjectRepository projectRepository;

    // 1. Chatbot Endpoint
    @PostMapping("/public/ai/chat")
    public ResponseEntity<?> chatbot(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Message cannot be empty!"));
        }

        String prompt = "You are the AI Assistant for DevNexa Global, a premium enterprise software development agency. "
                + "Provide concise, professional answers. "
                + "User asks: " + message;

        String reply = aiService.generateContent(prompt);
        Map<String, String> response = new HashMap<>();
        response.put("reply", reply);
        return ResponseEntity.ok(response);
    }

    // 2. Project Cost Estimator Endpoint
    @PostMapping("/public/ai/estimate")
    public ResponseEntity<?> estimateProjectCost(@RequestBody Map<String, Object> payload) {
        String serviceType = (String) payload.get("serviceType"); // web, mobile, custom, ai
        String complexity = (String) payload.get("complexity"); // simple, medium, complex
        String details = (String) payload.get("details");

        if (serviceType == null || complexity == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "serviceType and complexity are required!"));
        }

        String prompt = "Calculate a realistic enterprise software cost estimate. "
                + "Service Type: " + serviceType + ", Complexity: " + complexity + ". "
                + "Brief project scope: " + details + ". "
                + "Provide a structured breakdown including: Estimated Cost Range, Estimated Duration, and Proposed Tech Stack.";

        String estimation = aiService.generateContent(prompt);
        Map<String, String> response = new HashMap<>();
        response.put("estimation", estimation);
        return ResponseEntity.ok(response);
    }

    // 3. Website Audit Endpoint
    @PostMapping("/public/ai/audit")
    public ResponseEntity<?> auditWebsite(@RequestBody Map<String, String> payload) {
        String url = payload.get("url");
        if (url == null || url.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Website URL is required!"));
        }

        // Generate a mock SEO Audit report
        Map<String, Object> auditReport = new HashMap<>();
        auditReport.put("url", url);
        auditReport.put("performanceScore", 92);
        auditReport.put("seoScore", 88);
        auditReport.put("accessibilityScore", 95);
        
        String prompt = "Provide a brief SEO and performance optimization audit advice report for a website with URL: " + url
                + ". The scores are: Performance: 92/100, SEO: 88/100, Accessibility: 95/100. Mention gzip compression, canonical URLs, and image lazy-loading advice.";
        
        String recommendations = aiService.generateContent(prompt);
        auditReport.put("recommendations", recommendations);

        return ResponseEntity.ok(auditReport);
    }

    // 4. Proposal Generator (Secured for client portal / admins)
    @PostMapping("/portal/ai/proposal")
    public ResponseEntity<?> generateProposal(@RequestBody Map<String, Long> payload) {
        Long projectId = payload.get("projectId");
        if (projectId == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "projectId is required!"));
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        String prompt = "Draft a formal software engineering project scope and development proposal based on the following project: "
                + "Title: " + project.getTitle() + ", Details: " + project.getDescription() + ", Budget: $" + project.getBudget() + ". "
                + "Structure the proposal with: Introduction, Proposed Architecture, Sprint Milestones Timeline, and Post-Launch Uptime Guarantees.";

        String proposal = aiService.generateContent(prompt);
        Map<String, String> response = new HashMap<>();
        response.put("proposal", proposal);
        return ResponseEntity.ok(response);
    }

    // 5. AI Blog Post Generator
    @PostMapping("/public/ai/blog")
    public ResponseEntity<?> generateBlogPost(@RequestBody Map<String, String> payload) {
        String topic = payload.get("topic");
        String tone = payload.getOrDefault("tone", "professional");
        String keywords = payload.getOrDefault("keywords", "");

        if (topic == null || topic.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "topic is required"));
        }

        String prompt = "Write a high-quality, SEO-optimized blog post for DevNexa Global's website. "
                + "Topic: " + topic + ". Tone: " + tone + ". "
                + (keywords.isEmpty() ? "" : "Target keywords: " + keywords + ". ")
                + "Structure: Title, Introduction, 3-4 main sections with subheadings, Key Takeaways, and Conclusion. "
                + "Keep it informative, engaging, and around 600-900 words.";

        String content = aiService.generateContent(prompt);
        Map<String, String> response = new HashMap<>();
        response.put("blogContent", content);
        response.put("topic", topic);
        return ResponseEntity.ok(response);
    }

    // 6. AI Email Draft Generator
    @PostMapping("/public/ai/email")
    public ResponseEntity<?> generateEmailDraft(@RequestBody Map<String, String> payload) {
        String purpose = payload.get("purpose");
        String recipientName = payload.getOrDefault("recipientName", "Client");
        String context = payload.getOrDefault("context", "");

        if (purpose == null || purpose.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "purpose is required"));
        }

        String prompt = "Draft a professional business email for DevNexa Global. "
                + "Purpose: " + purpose + ". "
                + "Recipient name: " + recipientName + ". "
                + (context.isEmpty() ? "" : "Additional context: " + context + ". ")
                + "Format: Subject line, greeting, body paragraphs, professional closing. "
                + "Tone: Polished, confident, and concise.";

        String draft = aiService.generateContent(prompt);
        Map<String, String> response = new HashMap<>();
        response.put("emailDraft", draft);
        response.put("purpose", purpose);
        return ResponseEntity.ok(response);
    }

    // 7. AI Project Scope Document Generator
    @PostMapping("/public/ai/scope")
    public ResponseEntity<?> generateScopeDocument(@RequestBody Map<String, Object> payload) {
        String projectName = (String) payload.getOrDefault("projectName", "Unnamed Project");
        String description = (String) payload.getOrDefault("description", "");
        String budget = (String) payload.getOrDefault("budget", "unspecified");
        String timeline = (String) payload.getOrDefault("timeline", "unspecified");

        if (description == null || description.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "description is required"));
        }

        String prompt = "Generate a detailed project scope document for DevNexa Global's client project. "
                + "Project Name: " + projectName + ". "
                + "Description: " + description + ". "
                + "Budget: " + budget + ". Timeline: " + timeline + ". "
                + "Sections to include: Executive Summary, Project Objectives, Deliverables, "
                + "Technical Requirements, Out of Scope, Sprint Milestones, Acceptance Criteria, "
                + "Assumptions & Risks, and Payment Schedule.";

        String scopeDoc = aiService.generateContent(prompt);
        Map<String, String> response = new HashMap<>();
        response.put("scopeDocument", scopeDoc);
        response.put("projectName", projectName);
        return ResponseEntity.ok(response);
    }

    // 8. AI Marketing Suggestions Generator
    @PostMapping("/public/ai/marketing")
    public ResponseEntity<?> generateMarketingSuggestions(@RequestBody Map<String, String> payload) {
        String industry = payload.getOrDefault("industry", "software development");
        String targetAudience = payload.getOrDefault("targetAudience", "startup founders");
        String goals = payload.getOrDefault("goals", "increase leads");

        String prompt = "Provide creative, actionable digital marketing strategy suggestions for DevNexa Global. "
                + "Industry focus: " + industry + ". "
                + "Target audience: " + targetAudience + ". "
                + "Marketing goals: " + goals + ". "
                + "Include: Content Marketing ideas, Social Media strategy, SEO recommendations, "
                + "Lead generation tactics, and Email campaign suggestions. "
                + "Be specific, data-driven, and actionable.";

        String suggestions = aiService.generateContent(prompt);
        Map<String, String> response = new HashMap<>();
        response.put("marketingSuggestions", suggestions);
        response.put("targetAudience", targetAudience);
        return ResponseEntity.ok(response);
    }
}
