package com.devnexa.global.modules.portal;

import com.devnexa.global.modules.payment.InvoiceRepository;
import com.devnexa.global.modules.payment.Invoice;
import com.devnexa.global.modules.auth.UserRepository;
import com.devnexa.global.modules.auth.User;
import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.portal.Project;
import com.devnexa.global.modules.portal.ProjectRepository;
import com.devnexa.global.modules.portal.SupportTicket;
import com.devnexa.global.modules.portal.SupportTicketRepository;
import com.devnexa.global.modules.portal.TicketMessage;
import com.devnexa.global.modules.portal.TicketMessageRepository;
import com.devnexa.global.modules.portal.Milestone;
import com.devnexa.global.modules.portal.MilestoneRepository;
import com.devnexa.global.modules.auth.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portal")
public class PortalController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private TicketMessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    // 1. Projects
    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getClientProjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Project> projects = projectRepository.findByClientId(userPrincipal.getId());
        return ResponseEntity.ok(projects);
    }

    // 2. Invoices
    @GetMapping("/invoices")
    public ResponseEntity<List<Invoice>> getClientInvoices(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Invoice> invoices = invoiceRepository.findByClientId(userPrincipal.getId());
        return ResponseEntity.ok(invoices);
    }

    // 3. Tickets
    @GetMapping("/tickets")
    public ResponseEntity<List<SupportTicket>> getClientTickets(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SupportTicket> tickets = ticketRepository.findByClientId(userPrincipal.getId());
        return ResponseEntity.ok(tickets);
    }

    @PostMapping("/tickets")
    public ResponseEntity<?> createSupportTicket(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> payload) {
        
        String subject = payload.get("subject");
        String description = payload.get("description");
        String priorityStr = payload.get("priority"); // LOW, MEDIUM, HIGH, CRITICAL

        if (subject == null || description == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Subject and description are required!"));
        }

        User client = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportTicket.TicketPriority priority = SupportTicket.TicketPriority.MEDIUM;
        if (priorityStr != null) {
            try {
                priority = SupportTicket.TicketPriority.valueOf(priorityStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Fallback to MEDIUM
            }
        }

        SupportTicket ticket = new SupportTicket(subject, description, client, SupportTicket.TicketStatus.OPEN, priority);
        ticketRepository.save(ticket);

        return ResponseEntity.ok(ticket);
    }

    // 4. Ticket Messages (Chat)
    @GetMapping("/tickets/{ticketId}/messages")
    public ResponseEntity<?> getTicketMessages(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long ticketId) {

        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Enforce that only the client owner or an administrator can read the ticket messages
        if (!ticket.getClient().getId().equals(userPrincipal.getId()) &&
                userPrincipal.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return new ResponseEntity<>(new ApiResponse(false, "Unauthorized access!"), HttpStatus.FORBIDDEN);
        }

        List<TicketMessage> messages = messageRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/tickets/{ticketId}/messages")
    public ResponseEntity<?> sendTicketMessage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long ticketId,
            @RequestBody Map<String, String> payload) {

        String text = payload.get("message");
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Message body cannot be empty!"));
        }

        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Enforce authorization
        if (!ticket.getClient().getId().equals(userPrincipal.getId()) &&
                userPrincipal.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return new ResponseEntity<>(new ApiResponse(false, "Unauthorized access!"), HttpStatus.FORBIDDEN);
        }

        User sender = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        TicketMessage message = new TicketMessage(ticket, sender, text);
        messageRepository.save(message);

        // Update ticket updated_at time
        ticketRepository.save(ticket);

        return ResponseEntity.ok(message);
    }
}
