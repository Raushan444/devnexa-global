package com.devnexa.global.modules.payment;

import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.payment.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Create a Stripe PaymentIntent for a given invoice.
     * Client receives the clientSecret to complete payment on the frontend.
     */
    @PostMapping("/create-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Long> payload) {
        Long invoiceId = payload.get("invoiceId");
        if (invoiceId == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "invoiceId is required"));
        }
        try {
            Map<String, Object> result = paymentService.createPaymentIntent(invoiceId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Create a Razorpay Order for a given invoice.
     */
    @PostMapping("/razorpay/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody Map<String, Long> payload) {
        Long invoiceId = payload.get("invoiceId");
        if (invoiceId == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "invoiceId is required"));
        }
        try {
            Map<String, Object> result = paymentService.createRazorpayOrder(invoiceId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Verify a Razorpay payment signature after successful checkout on client.
     */
    @PostMapping("/razorpay/verify")
    public ResponseEntity<?> verifyRazorpayPayment(@RequestBody Map<String, String> payload) {
        String orderId = payload.get("orderId");
        String paymentId = payload.get("paymentId");
        String signature = payload.get("signature");

        if (orderId == null || paymentId == null || signature == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "orderId, paymentId, and signature are required"));
        }

        boolean isValid = paymentService.verifyRazorpaySignature(orderId, paymentId, signature);
        if (isValid) {
            return ResponseEntity.ok(new ApiResponse(true, "Payment verified successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid payment signature"));
        }
    }

    /**
      * Stripe webhook endpoint — receives real-time payment events.
      * Must be publicly accessible (no JWT). Raw body needed for signature verification.
      */
    @PostMapping("/webhook")
    public ResponseEntity<?> stripeWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        try {
            paymentService.processWebhook(payload, sigHeader);
            return ResponseEntity.ok(Map.of("received", true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Webhook error: " + e.getMessage()));
        }
    }
}
