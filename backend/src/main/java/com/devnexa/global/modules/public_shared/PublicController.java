package com.devnexa.global.modules.public_shared;

import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.public_shared.Appointment;
import com.devnexa.global.modules.blog.BlogPost;
import com.devnexa.global.modules.public_shared.AppointmentRepository;
import com.devnexa.global.modules.blog.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BlogPostRepository blogPostRepository;

    // 1. Schedule Appointment
    @PostMapping("/appointment")
    public ResponseEntity<?> scheduleAppointment(@RequestBody Map<String, String> payload) {
        try {
            String name = payload.get("name");
            String email = payload.get("email");
            String company = payload.get("company");
            String meetingType = payload.get("meetingType");
            String scheduledTimeStr = payload.get("scheduledTime");
            String description = payload.get("description");

            if (name == null || email == null || meetingType == null || scheduledTimeStr == null || description == null) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Required fields are missing!"));
            }

            // Parse HTML datetime-local: yyyy-MM-dd'T'HH:mm
            LocalDateTime scheduledTime = LocalDateTime.parse(scheduledTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            Appointment appointment = new Appointment(name, email, company, meetingType, scheduledTime, description);
            appointmentRepository.save(appointment);

            return ResponseEntity.ok(new ApiResponse(true, "Appointment scheduled successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid date format or database error: " + e.getMessage()));
        }
    }

    // 2. Public Blogs
    @GetMapping("/blogs")
    public ResponseEntity<List<BlogPost>> getPublishedBlogs() {
        List<BlogPost> posts = blogPostRepository.findByPublished(true);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/blogs/{slug}")
    public ResponseEntity<?> getBlogBySlug(@PathVariable String slug) {
        Optional<BlogPost> postOpt = blogPostRepository.findBySlug(slug);
        if (postOpt.isPresent() && postOpt.get().isPublished()) {
            return ResponseEntity.ok(postOpt.get());
        }
        return ResponseEntity.notFound().build();
    }
}
