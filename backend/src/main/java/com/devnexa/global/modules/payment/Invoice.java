package com.devnexa.global.modules.payment;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.devnexa.global.modules.portal.Project;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private double amount;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status = InvoiceStatus.UNPAID;

    private LocalDate issueDate;

    private LocalDate dueDate;

    private String paymentUrl;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum InvoiceStatus {
        UNPAID,
        PAID,
        OVERDUE,
        VOID
    }

    public Invoice() {}

    public Invoice(String invoiceNumber, Project project, double amount, InvoiceStatus status, LocalDate issueDate, LocalDate dueDate, String paymentUrl) {
        this.invoiceNumber = invoiceNumber;
        this.project = project;
        this.amount = amount;
        this.status = status;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.paymentUrl = paymentUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public InvoiceStatus getStatus() { return status; }
    public void setStatus(InvoiceStatus status) { this.status = status; }

    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getPaymentUrl() { return paymentUrl; }
    public void setPaymentUrl(String paymentUrl) { this.paymentUrl = paymentUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
