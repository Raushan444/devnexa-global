package com.devnexa.global.modules.admin;

import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.payment.Invoice;
import com.devnexa.global.modules.auth.User;
import com.devnexa.global.modules.payment.InvoiceRepository;
import com.devnexa.global.modules.auth.UserRepository;
import com.devnexa.global.modules.admin.PdfExportService;
import com.lowagie.text.DocumentException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/admin/export")
public class ExportController {

    @Autowired
    private PdfExportService pdfExportService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Export a specific invoice as a PDF.
     */
    @GetMapping("/invoice/{invoiceId}/pdf")
    public ResponseEntity<?> exportInvoicePdf(@PathVariable Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        try {
            byte[] pdfBytes = pdfExportService.generateInvoicePdf(invoice);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"invoice-" + invoice.getInvoiceNumber() + ".pdf\"")
                    .body(pdfBytes);
        } catch (DocumentException e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "PDF generation failed: " + e.getMessage()));
        }
    }

    /**
     * Export all users as an Excel (.xlsx) spreadsheet.
     */
    @GetMapping("/users/excel")
    public ResponseEntity<?> exportUsersExcel() throws IOException {
        List<User> users = userRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Users");

            // Header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            String[] headers = {"ID", "Username", "Email", "Roles", "Enabled", "Created At"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowNum = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getUsername());
                row.createCell(2).setCellValue(user.getEmail());
                row.createCell(3).setCellValue(user.getRoles().toString());
                row.createCell(4).setCellValue(user.isEnabled() ? "Yes" : "No");
                row.createCell(5).setCellValue(
                        user.getCreatedAt() != null
                                ? user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                                : ""
                );
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"users-export.xlsx\"")
                    .body(out.toByteArray());
        }
    }

    /**
     * Export all invoices as an Excel spreadsheet.
     */
    @GetMapping("/invoices/excel")
    public ResponseEntity<?> exportInvoicesExcel() throws IOException {
        List<Invoice> invoices = invoiceRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Invoices");

            // Header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            String[] headers = {"ID", "Invoice Number", "Project", "Amount", "Status", "Issue Date", "Due Date"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowNum = 1;
            for (Invoice invoice : invoices) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(invoice.getId());
                row.createCell(1).setCellValue(invoice.getInvoiceNumber());
                row.createCell(2).setCellValue(
                        invoice.getProject() != null ? invoice.getProject().getTitle() : "N/A");
                row.createCell(3).setCellValue(invoice.getAmount());
                row.createCell(4).setCellValue(invoice.getStatus().name());
                row.createCell(5).setCellValue(
                        invoice.getIssueDate() != null
                                ? invoice.getIssueDate().format(DateTimeFormatter.ISO_LOCAL_DATE)
                                : "");
                row.createCell(6).setCellValue(
                        invoice.getDueDate() != null
                                ? invoice.getDueDate().format(DateTimeFormatter.ISO_LOCAL_DATE)
                                : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"invoices-export.xlsx\"")
                    .body(out.toByteArray());
        }
    }
}
