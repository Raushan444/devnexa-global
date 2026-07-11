package com.devnexa.global.config;

import com.devnexa.global.modules.public_shared.AppointmentRepository;
import com.devnexa.global.modules.public_shared.Appointment;
import com.devnexa.global.modules.payment.InvoiceRepository;
import com.devnexa.global.modules.payment.Invoice;
import com.devnexa.global.modules.blog.BlogPostRepository;
import com.devnexa.global.modules.blog.BlogPost;
import com.devnexa.global.modules.portal.TicketMessageRepository;
import com.devnexa.global.modules.portal.TicketMessage;
import com.devnexa.global.modules.portal.SupportTicketRepository;
import com.devnexa.global.modules.portal.SupportTicket;
import com.devnexa.global.modules.auth.UserRepository;
import com.devnexa.global.modules.auth.User;
import com.devnexa.global.modules.auth.Role;
import com.devnexa.global.modules.auth.WebSecurityConfig;
import com.devnexa.global.modules.portal.Project;
import com.devnexa.global.modules.portal.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private TicketMessageRepository messageRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Admin User
            User admin = new User("admin", "admin@devnexa.global", passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(Role.ROLE_ADMIN));
            admin.setEmailVerified(true);
            userRepository.save(admin);

            // Seed Client User
            User client = new User("client", "client@devnexa.global", passwordEncoder.encode("client123"));
            client.setRoles(Set.of(Role.ROLE_CLIENT));
            client.setEmailVerified(true);
            userRepository.save(client);

            // Seed Member (Staff/Developer) User
            User member = new User("member", "member@devnexa.global", passwordEncoder.encode("member123"));
            member.setRoles(Set.of(Role.ROLE_MEMBER));
            member.setEmailVerified(true);
            userRepository.save(member);

            System.out.println("Default users seeded: admin/admin123, client/client123, member/member123");

            // Seed Client Projects
            Project project1 = new Project(
                    "DevNexa E-Commerce Platform",
                    "Redesigning client e-commerce backend APIs and deploying Next.js 15 product landing pages.",
                    client,
                    Project.ProjectStatus.DEVELOPMENT,
                    65,
                    LocalDate.now().minusDays(30),
                    LocalDate.now().plusDays(45),
                    25000.00
            );
            projectRepository.save(project1);

            Project project2 = new Project(
                    "Enterprise CRM Integration",
                    "Discovery phase for scoping CRM customer logs, Salesforce pipeline sync, and data warehousing.",
                    client,
                    Project.ProjectStatus.DISCOVERY,
                    15,
                    LocalDate.now().minusDays(5),
                    LocalDate.now().plusDays(90),
                    18000.00
            );
            projectRepository.save(project2);

            System.out.println("Mock projects seeded for client.");

            // Seed Invoices
            Invoice invoice1 = new Invoice(
                    "INV-2026-001",
                    project1,
                    12500.00,
                    Invoice.InvoiceStatus.PAID,
                    LocalDate.now().minusDays(30),
                    LocalDate.now().minusDays(15),
                    "https://stripe.com/pay/inv_mock_001"
            );
            invoiceRepository.save(invoice1);

            Invoice invoice2 = new Invoice(
                    "INV-2026-002",
                    project1,
                    12500.00,
                    Invoice.InvoiceStatus.UNPAID,
                    LocalDate.now(),
                    LocalDate.now().plusDays(15),
                    "https://stripe.com/pay/inv_mock_002"
            );
            invoiceRepository.save(invoice2);

            System.out.println("Mock invoices seeded.");

            // Seed Support Ticket & Support Chats
            SupportTicket ticket = new SupportTicket(
                    "API Integration Issue with OAuth Redirects",
                    "OAuth callbacks from GitHub are returning CORS warnings. Please check credentials configuration.",
                    client,
                    SupportTicket.TicketStatus.OPEN,
                    SupportTicket.TicketPriority.HIGH
            );
            ticketRepository.save(ticket);

            TicketMessage message1 = new TicketMessage(ticket, client, "GitHub OAuth callback triggers CORS issues on localhost. Can you review WebSecurityConfig mappings?");
            messageRepository.save(message1);

            TicketMessage message2 = new TicketMessage(ticket, member, "Hi! I see the issue. We need to expose credentials in the CORS filter config. I will commit a fix to WebSecurityConfig shortly.");
            messageRepository.save(message2);

            System.out.println("Mock support chat history seeded.");

            // Seed Appointments (Consultations)
            Appointment appt1 = new Appointment(
                    "David Miller",
                    "david@millerindustries.com",
                    "Miller Industries",
                    "CONSULTATION",
                    LocalDateTime.now().plusDays(3).withHour(10).withMinute(0),
                    "Scoping meeting to discuss migrating database logs to Postgres."
            );
            appointmentRepository.save(appt1);

            Appointment appt2 = new Appointment(
                    "Samantha Reed",
                    "samantha@reedsolutions.io",
                    "Reed Solutions",
                    "AUDIT",
                    LocalDateTime.now().plusDays(5).withHour(14).withMinute(30),
                    "Need a complete SEO and speed audit on our Next.js staging pages."
            );
            appointmentRepository.save(appt2);

            System.out.println("Mock appointments seeded.");

            // Seed Blog Posts
            BlogPost blog1 = new BlogPost(
                    "Building Decoupled Next.js 15 & Spring Boot Architectures",
                    "nextjs-spring-boot-architecture",
                    "Enterprise web applications demand high security, swift hot-reloading, and robust database persistence layers. Combining Next.js 15 (for rendering layouts) with Spring Boot 3.x (for data safety and microservice APIs) represents a premium software stack.",
                    "A comprehensive guide on structuring enterprise-ready web platforms with custom JWT configurations, CORS rules, and docker staging.",
                    admin,
                    "Architecture",
                    "Next.js 15,Spring Boot,Security,JWT",
                    "Building Decoupled Next.js 15 & Spring Boot Architectures",
                    "A comprehensive guide on structuring enterprise-ready web platforms with custom JWT configurations, CORS rules, and docker staging.",
                    "/blog-arch.jpg",
                    true
            );
            blogPostRepository.save(blog1);

            BlogPost blog2 = new BlogPost(
                    "The Power of Tailwind CSS v4 in Modern Web Design",
                    "tailwindcss-v4-benefits",
                    "Tailwind CSS v4 introduces compilation speed improvements using Rust-based parsing engines and introduces a clean '@theme' syntax that simplifies stylesheet configurations.",
                    "Discover the new CSS-first configuration layer in Tailwind CSS v4 and how it simplifies glassmorphic UI setups.",
                    admin,
                    "UI/UX Design",
                    "CSS,Tailwind CSS,Design System",
                    "The Power of Tailwind CSS v4 in Modern Web Design",
                    "Discover the new CSS-first configuration layer in Tailwind CSS v4 and how it simplifies glassmorphic UI setups.",
                    "/blog-design.jpg",
                    true
            );
            blogPostRepository.save(blog2);

            System.out.println("Mock blog posts seeded.");
        }
    }
}
