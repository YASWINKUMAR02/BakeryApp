package com.bakery.app.repository;

import com.bakery.app.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserIdAndUserRoleOrderByCreatedAtDesc(Long userId, String userRole);
    
    List<Notification> findByUserIdAndUserRoleAndReadFalseOrderByCreatedAtDesc(Long userId, String userRole);
    
    Long countByUserIdAndUserRoleAndReadFalse(Long userId, String userRole);
}
