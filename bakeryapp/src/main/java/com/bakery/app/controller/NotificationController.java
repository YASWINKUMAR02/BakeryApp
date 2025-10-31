package com.bakery.app.controller;

import com.bakery.app.dto.NotificationDTO;
import com.bakery.app.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody NotificationDTO notificationDTO) {
        Map<String, Object> response = new HashMap<>();
        try {
            NotificationDTO created = notificationService.createNotification(notificationDTO);
            response.put("success", true);
            response.put("message", "Notification created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create notification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getAllNotifications(
            @PathVariable Long userId,
            @RequestParam(required = false, defaultValue = "CUSTOMER") String userRole) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<NotificationDTO> notifications = notificationService.getAllNotificationsByUserId(userId, userRole);
            response.put("success", true);
            response.put("data", notifications);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch notifications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/{userId}/unread")
    public ResponseEntity<Map<String, Object>> getUnreadNotifications(
            @PathVariable Long userId,
            @RequestParam(required = false, defaultValue = "CUSTOMER") String userRole) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<NotificationDTO> notifications = notificationService.getUnreadNotificationsByUserId(userId, userRole);
            Long unreadCount = notificationService.getUnreadCount(userId, userRole);
            response.put("success", true);
            response.put("data", notifications);
            response.put("unreadCount", unreadCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch unread notifications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long notificationId) {
        Map<String, Object> response = new HashMap<>();
        try {
            notificationService.markAsRead(notificationId);
            response.put("success", true);
            response.put("message", "Notification marked as read");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to mark notification as read: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PutMapping("/{userId}/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @PathVariable Long userId,
            @RequestParam(required = false, defaultValue = "CUSTOMER") String userRole) {
        Map<String, Object> response = new HashMap<>();
        try {
            notificationService.markAllAsRead(userId, userRole);
            response.put("success", true);
            response.put("message", "All notifications marked as read");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to mark all notifications as read: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable Long notificationId) {
        Map<String, Object> response = new HashMap<>();
        try {
            notificationService.deleteNotification(notificationId);
            response.put("success", true);
            response.put("message", "Notification deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete notification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
