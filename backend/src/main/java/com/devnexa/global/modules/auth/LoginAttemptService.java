package com.devnexa.global.modules.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class LoginAttemptService {

    private static final Logger logger = LoggerFactory.getLogger(LoginAttemptService.class);
    private static final int MAX_ATTEMPTS = 5;
    private static final String PREFIX = "login_attempts:";

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    // Local memory fallback for environments without Redis running
    private final java.util.concurrent.ConcurrentHashMap<String, Integer> localAttemptsMap = new java.util.concurrent.ConcurrentHashMap<>();
    private final java.util.concurrent.ConcurrentHashMap<String, Long> localBlockExpiryMap = new java.util.concurrent.ConcurrentHashMap<>();

    public void loginFailed(String ipAddress) {
        if (redisTemplate != null) {
            String key = PREFIX + ipAddress;
            Long attempts = redisTemplate.opsForValue().increment(key);
            if (attempts != null && attempts == 1) {
                redisTemplate.expire(key, 15, TimeUnit.MINUTES);
            }
            logger.warn("Failed login attempt from IP: {} (attempt {})", ipAddress, attempts);
        } else {
            // Local fallback
            long now = System.currentTimeMillis();
            // If previous block expired, reset attempts
            Long blockExpiry = localBlockExpiryMap.get(ipAddress);
            if (blockExpiry != null && now > blockExpiry) {
                localAttemptsMap.remove(ipAddress);
                localBlockExpiryMap.remove(ipAddress);
            }

            int attempts = localAttemptsMap.compute(ipAddress, (k, v) -> (v == null ? 1 : v + 1));
            if (attempts >= MAX_ATTEMPTS) {
                localBlockExpiryMap.put(ipAddress, now + TimeUnit.MINUTES.toMillis(15));
            }
            logger.warn("Failed login attempt (Local Fallback) from IP: {} (attempt {})", ipAddress, attempts);
        }
    }

    public void loginSucceeded(String ipAddress) {
        if (redisTemplate != null) {
            redisTemplate.delete(PREFIX + ipAddress);
        } else {
            localAttemptsMap.remove(ipAddress);
            localBlockExpiryMap.remove(ipAddress);
        }
    }

    public boolean isBlocked(String ipAddress) {
        if (redisTemplate != null) {
            String key = PREFIX + ipAddress;
            Object val = redisTemplate.opsForValue().get(key);
            if (val == null) return false;
            int attempts = Integer.parseInt(val.toString());
            return attempts >= MAX_ATTEMPTS;
        } else {
            Long expiry = localBlockExpiryMap.get(ipAddress);
            if (expiry != null) {
                if (System.currentTimeMillis() > expiry) {
                    localAttemptsMap.remove(ipAddress);
                    localBlockExpiryMap.remove(ipAddress);
                    return false;
                }
                return true;
            }
            return false;
        }
    }
}
