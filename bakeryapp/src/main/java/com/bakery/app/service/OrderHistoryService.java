package com.bakery.app.service;

import com.bakery.app.entity.*;
import com.bakery.app.repository.OrderHistoryItemRepository;
import com.bakery.app.repository.OrderHistoryRepository;
import com.bakery.app.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderHistoryService {
    
    private final OrderHistoryRepository orderHistoryRepository;
    private final OrderHistoryItemRepository orderHistoryItemRepository;
    private final OrderRepository orderRepository;
    
    @Transactional
    public OrderHistory moveOrderToHistory(Order order) {
        if (!"Delivered".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only delivered orders can be moved to history");
        }
        
        // Create order history
        OrderHistory orderHistory = new OrderHistory();
        orderHistory.setCustomerId(order.getCustomer().getId());
        orderHistory.setCustomerName(order.getCustomerName());
        orderHistory.setOrderDate(order.getOrderDate());
        orderHistory.setDeliveredDate(LocalDateTime.now());
        orderHistory.setTotalAmount(order.getTotalAmount());
        orderHistory.setStatus("Delivered");
        orderHistory.setDeliveryAddress(order.getDeliveryAddress());
        orderHistory.setDeliveryPhone(order.getDeliveryPhone());
        orderHistory.setDeliveryNotes(order.getDeliveryNotes());
        
        // Save order history first
        OrderHistory savedOrderHistory = orderHistoryRepository.save(orderHistory);
        
        // Create order history items
        List<OrderHistoryItem> historyItems = new ArrayList<>();
        for (OrderItem orderItem : order.getOrderItems()) {
            OrderHistoryItem historyItem = new OrderHistoryItem();
            historyItem.setOrderHistory(savedOrderHistory);
            historyItem.setItemId(orderItem.getItem() != null ? orderItem.getItem().getId() : null);
            historyItem.setItemName(orderItem.getItemName());
            historyItem.setQuantity(orderItem.getQuantity());
            historyItem.setPrice(orderItem.getPrice());
            historyItem.setEggType(orderItem.getEggType());  // Transfer egg type
            historyItem.setSelectedWeight(orderItem.getSelectedWeight());  // Transfer selected weight
            historyItems.add(historyItem);
        }
        
        savedOrderHistory.setOrderItems(historyItems);
        orderHistoryRepository.save(savedOrderHistory);
        
        // Delete the original order (cascade will delete order items)
        orderRepository.delete(order);
        
        System.out.println("Moved order " + order.getId() + " to history");
        return savedOrderHistory;
    }
    
    @Transactional
    public void moveAllDeliveredOrdersToHistory() {
        List<Order> deliveredOrders = orderRepository.findAll().stream()
                .filter(order -> "Delivered".equalsIgnoreCase(order.getStatus()))
                .toList();
        
        for (Order order : deliveredOrders) {
            moveOrderToHistory(order);
        }
        
        System.out.println("Moved " + deliveredOrders.size() + " delivered orders to history");
    }
    
    @Transactional(readOnly = true)
    public List<OrderHistory> getOrderHistoryByCustomerId(Integer customerId) {
        List<OrderHistory> history = orderHistoryRepository.findByCustomerId(customerId);
        // Force initialization of orderItems
        history.forEach(oh -> oh.getOrderItems().size());
        return history;
    }
    
    @Transactional(readOnly = true)
    public List<OrderHistory> getAllOrderHistory() {
        List<OrderHistory> history = orderHistoryRepository.findAll();
        // Force initialization of orderItems
        history.forEach(oh -> oh.getOrderItems().size());
        return history;
    }
    
    public boolean isItemInOrderHistory(Integer itemId) {
        return orderHistoryItemRepository.countByItemId(itemId) > 0;
    }
}
