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
            return true;
        }
        try {
            org.json.JSONObject options = new org.json.JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);
            return com.razorpay.Utils.verifyPaymentSignature(options, razorpayKeySecret);
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
                // Extract invoice ID from metadata and mark invoice PAID
                logger.info("Payment succeeded event processed");
            }
        } catch (SignatureVerificationException e) {
            logger.error("Stripe webhook signature verification failed: {}", e.getMessage());
            throw new RuntimeException("Invalid Stripe signature");
        }
    }
}
