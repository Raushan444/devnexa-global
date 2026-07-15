package com.devnexa.global.modules.auth;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import com.devnexa.global.modules.admin.AuditService;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitingFilter.class);

    @Autowired
    private AuditService auditService;

    private final ConcurrentHashMap<String, RequestCounter> ipRequestMap = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 100;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (request instanceof HttpServletRequest && response instanceof HttpServletResponse) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;

            String ip = httpRequest.getRemoteAddr();
            long currentTime = System.currentTimeMillis();

            ipRequestMap.compute(ip, (key, counter) -> {
                if (counter == null || (currentTime - counter.timestamp) > 60000) {
                    return new RequestCounter(currentTime, 1);
                } else {
                    counter.count.incrementAndGet();
                    return counter;
                }
            });

            RequestCounter counter = ipRequestMap.get(ip);
            if (counter != null && counter.count.get() > MAX_REQUESTS_PER_MINUTE) {
                logger.warn("Rate limit violation for IP Address: {}. Total requests count: {}", ip, counter.count.get());
                try {
                    auditService.log("SYSTEM", "RATE_LIMIT_VIOLATION", "IP", ip, "IP Address " + ip + " exceeded maximum allowed request count: " + counter.count.get());
                } catch (Exception e) {
                    // Prevent security filter failure if db audit logging has transaction issue
                }
                httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"success\":false,\"message\":\"Too many requests. Please try again in a minute.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private static class RequestCounter {
        private final long timestamp;
        private final AtomicInteger count;

        private RequestCounter(long timestamp, int initialCount) {
            this.timestamp = timestamp;
            this.count = new AtomicInteger(initialCount);
        }
    }
}
