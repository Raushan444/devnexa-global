package com.devnexa.global.modules.auth;

import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.auth.Role;
import com.devnexa.global.modules.auth.User;
import com.devnexa.global.modules.auth.UserRepository;
import com.devnexa.global.modules.auth.JwtTokenProvider;
import com.devnexa.global.modules.auth.UserPrincipal;
import com.devnexa.global.modules.auth.LoginAttemptService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @Autowired
    private TokenBlacklistService blacklistService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest,
                                              HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);

        // Brute-force protection
        if (loginAttemptService.isBlocked(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ApiResponse(false, "Too many failed login attempts. Please try again in 15 minutes."));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail(),
                            loginRequest.getPassword()
                    )
            );

            loginAttemptService.loginSucceeded(ip);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(authentication);

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            List<String> roles = userPrincipal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            // Update last login metadata
            userRepository.findById(userPrincipal.getId()).ifPresent(u -> {
                u.setLastLoginAt(LocalDateTime.now());
                u.setLastLoginIp(ip);
                u.setFailedLoginAttempts(0);
                userRepository.save(u);
            });

            return ResponseEntity.ok(new JwtAuthenticationResponse(
                    jwt, refreshToken, userPrincipal.getId(),
                    userPrincipal.getUsername(), userPrincipal.getEmail(), roles));

        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(ip);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid username or password."));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return new ResponseEntity<>(new ApiResponse(false, "Username is already taken!"), HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new ResponseEntity<>(new ApiResponse(false, "Email Address already in use!"), HttpStatus.BAD_REQUEST);
        }

        // Creating user's account
        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), signUpRequest.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Set<Role> roles = new HashSet<>();
        if (signUpRequest.getRole() != null) {
            try {
                Role userRole = Role.valueOf("ROLE_" + signUpRequest.getRole().toUpperCase());
                roles.add(userRole);
            } catch (IllegalArgumentException e) {
                roles.add(Role.ROLE_CLIENT); // Fallback to CLIENT
            }
        } else {
            roles.add(Role.ROLE_CLIENT);
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully! Please check your email for verification."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        if (tokenProvider.validateToken(requestRefreshToken)) {
            Long userId = tokenProvider.getUserIdFromJWT(requestRefreshToken);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            String newAccessToken = tokenProvider.generateTokenFromUserId(user.getId(), 86400000); // 24 Hours
            String newRefreshToken = tokenProvider.generateTokenFromUserId(user.getId(), 604800000); // 7 Days

            List<String> roles = user.getRoles().stream()
                    .map(Role::name)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtAuthenticationResponse(newAccessToken, newRefreshToken, user.getId(), user.getUsername(), user.getEmail(), roles));
        }

        return new ResponseEntity<>(new ApiResponse(false, "Refresh token is invalid or expired!"), HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || !userRepository.existsByEmail(email)) {
            return new ResponseEntity<>(new ApiResponse(false, "Email address not found!"), HttpStatus.NOT_FOUND);
        }

        // Mock verification sending
        return ResponseEntity.ok(new ApiResponse(true, "Password reset link has been sent to your email."));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        // In production, match verification token. For prototyping we auto-verify.
        return ResponseEntity.ok(new ApiResponse(true, "Email verified successfully! You can now log in."));
    }

    @GetMapping("/debug-db")
    public ResponseEntity<?> debugDb() {
        Map<String, Object> status = new java.util.HashMap<>();
        try {
            status.put("userCount", userRepository.count());
            status.put("users", userRepository.findAll().stream().map(u -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("username", u.getUsername());
                map.put("email", u.getEmail());
                map.put("roles", u.getRoles().stream().map(Role::name).toList());
                return map;
            }).toList());
        } catch (Exception e) {
            status.put("error", e.getMessage());
        }
        return ResponseEntity.ok(status);
    }

    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody Map<String, String> payload) {
        String provider = payload.get("provider"); // google or github
        String email = payload.get("email");
        String name = payload.get("name");
        String oauthId = payload.get("id");

        if (email == null || provider == null) {
            return new ResponseEntity<>(new ApiResponse(false, "Invalid payload"), HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User(name.replace(" ", "").toLowerCase() + "_" + provider.toLowerCase(), email, null);
            newUser.setOauthProvider(provider.toUpperCase());
            newUser.setOauthId(oauthId);
            newUser.setEmailVerified(true);
            Set<Role> roles = new HashSet<>();
            roles.add(Role.ROLE_CLIENT);
            newUser.setRoles(roles);
            return userRepository.save(newUser);
        });

        // Generate tokens
        String jwt = tokenProvider.generateTokenFromUserId(user.getId(), 86400000);
        String refreshToken = tokenProvider.generateTokenFromUserId(user.getId(), 604800000);

        List<String> roles = user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, refreshToken, user.getId(), user.getUsername(), user.getEmail(), roles));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            long remainingMs = tokenProvider.getRemainingExpirationMs(token);
            blacklistService.blacklistToken(token, remainingMs);
        }
        return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully. Token invalidated."));
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
