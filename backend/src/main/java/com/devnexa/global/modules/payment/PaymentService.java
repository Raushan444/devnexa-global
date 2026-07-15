package com.devnexa.global.modules.payment;

import com.devnexa.global.modules.payment.Invoice;
import com.devnexa.global.modules.payment.InvoiceRepository;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.devnexa.global.modules.notification.NotificationService;
import com.devnexa.global.modules.notification.EmailService;
import com.devnexa.global.modules.notification.Notification;
import com.devnexa.global.modules.auth.User;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Value("${app.stripe.secret-key:}")
    private String stripeSecretKey;

    @Value("${app.stripe.webhook-secret:}")
    private String stripeWebhookSecret;

    @Value("${app.razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret:}")
    private String razorpayKeySecret;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    public Map<String, Object> createPaymentIntent(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (stripeSecretKey == null || stripeSecretKey.isEmpty()) {
            logger.warn("Stripe secret key not configured — returning mock intent");
            Map<String, Object> mock = new HashMap<>();
            mock.put("clientSecret", "pi_mock_" + invoiceId + "_secret_mock");
            mock.put("amount", (long)(invoice.getAmount() * 100));
            mock.put("currency", "usd");
            return mock;
        }

        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long)(invoice.getAmount() * 100))
                    .setCurrency("usd")
                    .putMetadata("invoice_id", invoiceId.toString())
                    .putMetadata("invoice_number", invoice.getInvoiceNumber())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            Map<String, Object> result = new HashMap<>();
            result.put("clientSecret", intent.getClientSecret());
            result.put("amount", intent.getAmount());
            result.put("currency", intent.getCurrency());
            return result;
        } catch (Exception e) {
            logger.error("Stripe error: {}", e.getMessage());
            throw new RuntimeException("Payment service error: " + e.getMessage());
        }
    }

    public Map<String, Object> createRazorpayOrder(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (razorpayKeyId == null || razorpayKeyId.isEmpty() || razorpayKeySecret == null || razorpayKeySecret.isEmpty()) {
            logger.warn("Razorpay keys not configured — returning mock order");
            Map<String, Object> mock = new HashMap<>();
            mock.put("orderId", "order_mock_" + invoiceId);
            mock.put("amount", (int)(invoice.getAmount() * 83.5 * 100)); // Default approx rate
            mock.put("currency", "INR");
            mock.put("keyId", "rzp_test_mockkey");
            return mock;
        }

        try {
            com.razorpay.RazorpayClient client = new com.razorpay.RazorpayClient(razorpayKeyId, razorpayKeySecret);
            org.json.JSONObject orderRequest = new org.json.JSONObject();
            orderRequest.put("amount", (int)(invoice.getAmount() * 83.5 * 100)); // USD to INR conversion * 100 paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + invoice.getInvoiceNumber());

            com.razorpay.Order order = client.orders.create(orderRequest);
            Map<String, Object> result = new HashMap<>();
            result.put("orderId", order.get("id"));
            result.put("amount", order.get("amount"));
            result.put("currency", order.get("currency"));
            result.put("keyId", razorpayKeyId);
            return result;
        } catch (Exception e) {
            logger.error("Razorpay error: {}", e.getMessage());
            throw new RuntimeException("Razorpay service error: " + e.getMessage());
        }
    }

    public boolean verifyRazorpaySignature(String orderId, String paymentId, String signature) {
        if (razorpayKeySecret == null || razorpayKeySecret.isEmpty()) {
            logger.warn("Razorpay key secret not configured — bypassing verification for dev mode");
            Long invoiceId = null;
            if (orderId.startsWith("order_mock_")) {
                try {
                    invoiceId = Long.parseLong(orderId.replace("order_mock_", ""));
                } catch (NumberFormatException e) {
                    logger.error("Failed to parse mock invoice ID");
                }
            }
            if (invoiceId != null) {
                invoiceRepository.findById(invoiceId).ifPresent(this::handlePaymentSuccess);
            }
            return true;
        }
        try {
            org.json.JSONObject options = new org.json.JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);
            boolean verified = com.razorpay.Utils.verifyPaymentSignature(options, razorpayKeySecret);
            if (verified) {
                // In production, find invoice by matching order ID or invoice number receipt metadata
                logger.info("Razorpay signature verified successfully.");
            }
            return verified;
        } catch (Exception e) {
            logger.error("Razorpay signature verification error: {}", e.getMessage());
            return false;
        }
    }

    public void processWebhook(String payload, String sigHeader) {
        if (stripeWebhookSecret == null || stripeWebhookSecret.isEmpty()) {
            logger.warn("Stripe webhook secret not configured — skipping verification");
            return;
        }
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
            logger.info("Stripe webhook event received: {}", event.getType());

            if ("payment_intent.succeeded".equals(event.getType())) {
                PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject()
                        .orElseThrow(() -> new RuntimeException("Stripe PaymentIntent deserialization failed"));
                
                String invoiceIdStr = paymentIntent.getMetadata().get("invoice_id");
                if (invoiceIdStr != null) {
                    Long invoiceId = Long.parseLong(invoiceIdStr);
                    invoiceRepository.findById(invoiceId).ifPresent(this::handlePaymentSuccess);
                }
            }
        } catch (SignatureVerificationException e) {
            logger.error("Stripe webhook signature verification failed: {}", e.getMessage());
            throw new RuntimeException("Invalid Stripe signature");
        }
    }

    private void handlePaymentSuccess(Invoice invoice) {
        if (invoice.getStatus() == Invoice.InvoiceStatus.PAID) {
            return; // Already processed
        }
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        invoiceRepository.save(invoice);
        logger.info("Invoice {} marked as PAID successfully.", invoice.getInvoiceNumber());

        User client = invoice.getProject().getClient();
        if (client != null) {
            // Trigger in-app notification
            String notifTitle = "Payment Received: " + invoice.getInvoiceNumber();
            String notifMsg = "Thank you! We received your payment of $" + invoice.getAmount() + " for your active project milestone.";
            notificationService.create(notifTitle, notifMsg, Notification.NotificationType.SUCCESS, client);

            // Send confirmation email
            String emailSub = "Payment Confirmation: " + invoice.getInvoiceNumber();
            String emailBody = "<h3>Payment Confirmed</h3>"
                    + "<p>Dear " + client.getUsername() + ",</p>"
                    + "<p>We have successfully processed your payment of <b>$" + invoice.getAmount() + "</b> for invoice <b>" + invoice.getInvoiceNumber() + "</b>.</p>"
                    + "<p>Thank you for partnering with DevNexa Global!</p>";
            emailService.sendDirectEmail(client.getEmail(), emailSub, emailBody, true);
        }
    }
}
