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

    public void loginFailed(String ipAddress) {
        if (redisTemplate == null) {
            logger.warn("Redis not available — login attempt tracking disabled");
            return;
        }
        String key = PREFIX + ipAddress;
        Long attempts = redisTemplate.opsForValue().increment(key);
        if (attempts != null && attempts == 1) {
            redisTemplate.expire(key, 15, TimeUnit.MINUTES);
        }
        logger.warn("Failed login attempt from IP: {} (attempt {})", ipAddress, attempts);
    }

    public void loginSucceeded(String ipAddress) {
        if (redisTemplate == null) return;
        redisTemplate.delete(PREFIX + ipAddress);
    }

    public boolean isBlocked(String ipAddress) {
        if (redisTemplate == null) return false;
        String key = PREFIX + ipAddress;
        Object val = redisTemplate.opsForValue().get(key);
        if (val == null) return false;
        int attempts = Integer.parseInt(val.toString());
        return attempts >= MAX_ATTEMPTS;
    }
}
