package com.devnexa.global.modules.ai;

import com.devnexa.global.modules.crm.Lead;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("YOUR_API_KEY_HERE")) {
            logger.warn("Gemini API key is not configured. Falling back to mock rule-based engine.");
            return generateMockReply(prompt);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Request Body
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", List.of(textPart));

            Map<String, Object> contents = new HashMap<>();
            contents.put("contents", List.of(parts));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(contents, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map body = response.getBody();
                List candidates = (List) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map contentMap = (Map) firstCandidate.get("content");
                    if (contentMap != null) {
                        List partsList = (List) contentMap.get("parts");
                        if (partsList != null && !partsList.isEmpty()) {
                            Map firstPart = (Map) partsList.get(0);
                            return (String) firstPart.get("text");
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error communicating with Gemini API: {}. Falling back to mock engine.", e.getMessage());
        }

        return generateMockReply(prompt);
    }

    private String generateMockReply(String prompt) {
        // Strip prompt template prefix to isolate target user query
        String userQuery = prompt;
        if (prompt.contains("User asks: ")) {
            userQuery = prompt.substring(prompt.indexOf("User asks: ") + 11);
        }
        String query = userQuery.toLowerCase();

        if (query.contains("cost") || query.contains("price") || query.contains("budget") || query.contains("how much")) {
            return "Based on your project goals, a decoupled Next.js + Spring Boot application typically costs between $15,000 to $30,000 depending on integrations. This includes fully tested code, JWT security filters, PostgreSQL database seeds, and Docker files.";
        }

        if (query.contains("service") || query.contains("what do you do") || query.contains("portfolio") || query.contains("capabilities")) {
            return "DevNexa Global specializes in Custom Software Engineering, Interactive Web Interfaces (Next.js 15), and Advanced AI Integrations (Gemini API LLM workflows, context search). Explore our Services page for details.";
        }

        if (query.contains("stack") || query.contains("technology") || query.contains("framework")) {
            return "We build using Next.js 15 App Router, React 19, Tailwind CSS v4, Framer Motion, and GSAP on the frontend. The backend is constructed using Java 21/26, Spring Boot, Spring Security (JWT), PostgreSQL database, and Redis cache clusters.";
        }

        return "Hi there! I am the DevNexa Global AI Assistant. I can help you estimate project costs, explain our technical architecture stack, or draft development proposals. How can I help you today?";
    }

    /** Generate a blog post given a topic and optional tone/keywords. */
    public String generateBlogPost(String topic, String tone, String keywords) {
        String prompt = "Write a high-quality, SEO-optimized blog post for DevNexa Global. "
                + "Topic: " + topic + ". Tone: " + (tone != null ? tone : "professional") + ". "
                + (keywords != null && !keywords.isEmpty() ? "Keywords: " + keywords + ". " : "")
                + "Include: Title, Introduction, 3-4 sections, Key Takeaways, and Conclusion.";
        return generateContent(prompt);
    }

    /** Draft a professional email given a purpose and recipient context. */
    public String generateEmailDraft(String purpose, String recipientName, String context) {
        String prompt = "Draft a professional business email for DevNexa Global. "
                + "Purpose: " + purpose + ". Recipient: " + (recipientName != null ? recipientName : "Client") + ". "
                + (context != null && !context.isEmpty() ? "Context: " + context + ". " : "")
                + "Include subject line, greeting, concise body, and a professional closing.";
        return generateContent(prompt);
    }

    /** Generate actionable marketing suggestions for a given audience and goals. */
    public String generateMarketingSuggestions(String industry, String targetAudience, String goals) {
        String prompt = "Provide creative, data-driven digital marketing strategy suggestions for DevNexa Global. "
                + "Industry: " + (industry != null ? industry : "software") + ". "
                + "Audience: " + (targetAudience != null ? targetAudience : "startup founders") + ". "
                + "Goals: " + (goals != null ? goals : "increase leads") + ". "
                + "Cover: Content marketing, Social media, SEO, Lead generation, and Email campaigns.";
        return generateContent(prompt);
    }

    /** Generate a full project scope document. */
    public String generateScopeDocument(String projectName, String description, String budget, String timeline) {
        String prompt = "Generate a detailed project scope document for a DevNexa Global client. "
                + "Project: " + projectName + ". Description: " + description + ". "
                + "Budget: " + (budget != null ? budget : "TBD") + ". "
                + "Timeline: " + (timeline != null ? timeline : "TBD") + ". "
                + "Sections: Executive Summary, Objectives, Deliverables, Tech Requirements, "
                + "Out of Scope, Sprint Milestones, Acceptance Criteria, Assumptions & Risks, Payment Schedule.";
        return generateContent(prompt);
    }
}
