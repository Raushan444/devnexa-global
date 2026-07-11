package com.devnexa.global.modules.admin;

import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.public_shared.Appointment;
import com.devnexa.global.modules.blog.BlogPost;
import com.devnexa.global.modules.payment.Invoice;
import com.devnexa.global.modules.auth.Role;
import com.devnexa.global.modules.auth.User;
import com.devnexa.global.modules.public_shared.AppointmentRepository;
import com.devnexa.global.modules.blog.BlogPostRepository;
import com.devnexa.global.modules.payment.InvoiceRepository;
import com.devnexa.global.modules.portal.ProjectRepository;
import com.devnexa.global.modules.auth.UserRepository;
import com.devnexa.global.modules.auth.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    // 1. Dashboard Metrics Analytics
    @GetMapping("/analytics")
    public ResponseEntity<?> getDashboardAnalytics() {
        long totalUsers = userRepository.count();
        long totalProjects = projectRepository.count();
        long totalAppointments = appointmentRepository.count();
        long totalBlogs = blogPostRepository.count();

        // Calculate sum of project budgets
        double totalBudgets = projectRepository.findAll().stream()
                .mapToDouble(p -> p.getBudget())
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalProjects", totalProjects);
        stats.put("totalAppointments", totalAppointments);
        stats.put("totalBlogs", totalBlogs);
        stats.put("totalBudgets", totalBudgets);

        return ResponseEntity.ok(stats);
    }

    // 2. User Accounts list
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 3. Appointments & Status updating
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        String status = payload.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Status is required!"));
        }

        appointment.setStatus(status.toUpperCase());
        appointmentRepository.save(appointment);
        return ResponseEntity.ok(appointment);
    }

    // 4. Blog Posts CMS Control
    @GetMapping("/blogs")
    public ResponseEntity<List<BlogPost>> getAllBlogPosts() {
        return ResponseEntity.ok(blogPostRepository.findAll());
    }

    @PostMapping("/blogs")
    public ResponseEntity<?> createBlogPost(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Object> payload) {

        String title = (String) payload.get("title");
        String content = (String) payload.get("content");
        String summary = (String) payload.get("summary");
        String category = (String) payload.get("category");
        String tags = (String) payload.get("tags");
        String featuredImageUrl = (String) payload.get("featuredImageUrl");
        Boolean published = (Boolean) payload.get("published");

        if (title == null || content == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Title and Content are required!"));
        }

        User author = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        // Generate slug from title
        String slug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");

        // Verify slug uniqueness
        if (blogPostRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis() % 1000;
        }

        BlogPost post = new BlogPost(
                title,
                slug,
                content,
                summary,
                author,
                category,
                tags,
                title, // seoTitle defaults to title
                summary, // seoDescription defaults to summary
                featuredImageUrl != null ? featuredImageUrl : "/blog-default.jpg",
                published != null ? published : false
        );

        blogPostRepository.save(post);
        return ResponseEntity.ok(post);
    }

    @PutMapping("/blogs/{id}")
    public ResponseEntity<?> updateBlogPost(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));

        if (payload.containsKey("title")) post.setTitle((String) payload.get("title"));
        if (payload.containsKey("content")) post.setContent((String) payload.get("content"));
        if (payload.containsKey("summary")) post.setSummary((String) payload.get("summary"));
        if (payload.containsKey("category")) post.setCategory((String) payload.get("category"));
        if (payload.containsKey("tags")) post.setTags((String) payload.get("tags"));
        if (payload.containsKey("featuredImageUrl")) post.setFeaturedImageUrl((String) payload.get("featuredImageUrl"));
        if (payload.containsKey("published")) post.setPublished((Boolean) payload.get("published"));

        blogPostRepository.save(post);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<?> deleteBlogPost(@PathVariable Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));

        blogPostRepository.delete(post);
        return ResponseEntity.ok(new ApiResponse(true, "Blog post deleted successfully."));
    }

    // 5. Monthly Revenue Stats
    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueStats() {
        List<Invoice> allInvoices = invoiceRepository.findAll();

        double totalRevenue = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.InvoiceStatus.PAID)
                .mapToDouble(Invoice::getAmount)
                .sum();

        double pendingRevenue = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.InvoiceStatus.UNPAID)
                .mapToDouble(Invoice::getAmount)
                .sum();

        double overdueRevenue = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.InvoiceStatus.OVERDUE)
                .mapToDouble(Invoice::getAmount)
                .sum();

        // Monthly breakdown — group paid invoices by month
        Map<String, Double> monthlyRevenue = allInvoices.stream()
                .filter(i -> i.getStatus() == Invoice.InvoiceStatus.PAID && i.getIssueDate() != null)
                .collect(Collectors.groupingBy(
                        i -> i.getIssueDate().getYear() + "-" + String.format("%02d", i.getIssueDate().getMonthValue()),
                        Collectors.summingDouble(Invoice::getAmount)
                ));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingRevenue", pendingRevenue);
        stats.put("overdueRevenue", overdueRevenue);
        stats.put("monthlyRevenue", monthlyRevenue);
        stats.put("totalInvoices", allInvoices.size());

        return ResponseEntity.ok(stats);
    }

    // 6. List all users with their roles
    @GetMapping("/roles")
    public ResponseEntity<?> getUsersWithRoles() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream().map(u -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", u.getId());
            entry.put("username", u.getUsername());
            entry.put("email", u.getEmail());
            entry.put("roles", u.getRoles());
            entry.put("enabled", u.isEnabled());
            return entry;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // 7. Change a user's role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String roleStr = payload.get("role");
        if (roleStr == null || roleStr.isBlank()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "role field is required"));
        }

        try {
            // Accept "ADMIN", "CLIENT", or full "ROLE_ADMIN" etc.
            String normalized = roleStr.toUpperCase();
            if (!normalized.startsWith("ROLE_")) {
                normalized = "ROLE_" + normalized;
            }
            Role role = Role.valueOf(normalized);
            java.util.Set<Role> newRoles = new java.util.HashSet<>();
            newRoles.add(role);
            user.setRoles(newRoles);
            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse(true, "User role updated to " + role.name()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid role: " + roleStr));
        }
    }
}
