package com.devnexa.global.modules.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {

    private static final Logger logger = LoggerFactory.getLogger(TokenBlacklistService.class);
    private static final String BLACKLIST_PREFIX = "jwt_blacklist:";

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    // Local map fallback if Redis is not available
    private final ConcurrentHashMap<String, Long> localBlacklist = new ConcurrentHashMap<>();

    public void blacklistToken(String token, long expirationMs) {
        if (redisTemplate != null) {
            String key = BLACKLIST_PREFIX + token;
            redisTemplate.opsForValue().set(key, "revoked", expirationMs, TimeUnit.MILLISECONDS);
            logger.info("Token blacklisted in Redis.");
        } else {
            long expiryTime = System.currentTimeMillis() + expirationMs;
            localBlacklist.put(token, expiryTime);
            logger.info("Token blacklisted in memory fallback registry.");
            cleanupExpiredTokens();
        }
    }

    public boolean isBlacklisted(String token) {
        if (redisTemplate != null) {
            String key = BLACKLIST_PREFIX + token;
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } else {
            Long expiry = localBlacklist.get(token);
            if (expiry != null) {
                if (System.currentTimeMillis() > expiry) {
                    localBlacklist.remove(token);
                    return false;
                }
                return true;
            }
            return false;
        }
    }

    private void cleanupExpiredTokens() {
        long now = System.currentTimeMillis();
        localBlacklist.entrySet().removeIf(entry -> now > entry.getValue());
    }
}
