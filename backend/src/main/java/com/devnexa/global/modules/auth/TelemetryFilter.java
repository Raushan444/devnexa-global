package com.devnexa.global.modules.auth;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class TelemetryFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(TelemetryFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (request instanceof HttpServletRequest && response instanceof HttpServletResponse) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;

            long startTime = System.currentTimeMillis();
            String method = httpRequest.getMethod();
            String uri = httpRequest.getRequestURI();

            chain.doFilter(request, response);

            long duration = System.currentTimeMillis() - startTime;
            int status = httpResponse.getStatus();

            // Core telemetry metrics
            Runtime runtime = Runtime.getRuntime();
            long freeMemory = runtime.freeMemory() / (1024 * 1024);
            long totalMemory = runtime.totalMemory() / (1024 * 1024);
            long usedMemory = totalMemory - freeMemory;

            logger.info("TELEMETRY: [HTTP] {} {} | Status: {} | Duration: {}ms | JVM Memory: {}MB/{}MB Used",
                    method, uri, status, duration, usedMemory, totalMemory);
        } else {
            chain.doFilter(request, response);
        }
    }
}
