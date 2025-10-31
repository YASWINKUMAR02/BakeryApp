package com.bakery.app.service;

import com.bakery.app.dto.NotificationDTO;
import com.bakery.app.entity.Notification;
import com.bakery.app.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        Notification notification = new Notification();
        notification.setUserId(notificationDTO.getUserId());
        notification.setUserRole(notificationDTO.getUserRole());
        notification.setMessage(notificationDTO.getMessage());
        notification.setType(notificationDTO.getType());
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        Notification saved = notificationRepository.save(notification);
        return convertToDTO(saved);
    }
    
    public List<NotificationDTO> getAllNotificationsByUserId(Long userId, String userRole) {
        List<Notification> notifications = notificationRepository.findByUserIdAndUserRoleOrderByCreatedAtDesc(userId, userRole);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<NotificationDTO> getUnreadNotificationsByUserId(Long userId, String userRole) {
        List<Notification> notifications = notificationRepository.findByUserIdAndUserRoleAndReadFalseOrderByCreatedAtDesc(userId, userRole);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Long getUnreadCount(Long userId, String userRole) {
        return notificationRepository.countByUserIdAndUserRoleAndReadFalse(userId, userRole);
    }
    
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    public void markAllAsRead(Long userId, String userRole) {
        List<Notification> notifications = notificationRepository.findByUserIdAndUserRoleAndReadFalseOrderByCreatedAtDesc(userId, userRole);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
    
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUserId());
        dto.setUserRole(notification.getUserRole());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setRead(notification.getRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
