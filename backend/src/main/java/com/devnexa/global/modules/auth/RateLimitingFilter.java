package com.devnexa.global.modules.auth;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter implements Filter {

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
