package com.devnexa.global.modules.notification;

import com.devnexa.global.modules.public_shared.ApiResponse;
import com.devnexa.global.modules.notification.Notification;
import com.devnexa.global.modules.auth.UserPrincipal;
import com.devnexa.global.modules.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portal/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(notificationService.getForUser(user.getId()));
    }

    @GetMapping("/count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user.getId())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return ResponseEntity.ok(new ApiResponse(true, "Marked as read."));
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllRead(@AuthenticationPrincipal UserPrincipal user) {
        notificationService.markAllRead(user.getId());
        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read."));
    }
}
