package com.bakery.app.service;

import com.bakery.app.dto.CustomerRegistrationRequest;
import com.bakery.app.dto.DashboardStats;
import com.bakery.app.dto.LoginRequest;
import com.bakery.app.entity.Admin;
import com.bakery.app.entity.Order;
import com.bakery.app.entity.OrderHistory;
import com.bakery.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    
    public Admin loginAdmin(LoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return admin;
    }
    
    public Admin getAdminById(Integer id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
    }
    
    public Admin registerAdmin(CustomerRegistrationRequest request) {
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Admin email already exists");
        }
        
        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        
        return adminRepository.save(admin);
    }
    
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        
        // Get all orders
        List<Order> allOrders = orderRepository.findAll();
        List<OrderHistory> allOrderHistory = orderHistoryRepository.findAll();
        
        // Calculate order statistics
        stats.setTotalOrders((long) (allOrders.size() + allOrderHistory.size()));
        stats.setPendingOrders(allOrders.stream()
                .filter(order -> "CONFIRMED".equals(order.getStatus()))
                .count());
        stats.setDeliveredOrders((long) allOrderHistory.size());
        
        // Get customer, item, and category counts
        stats.setTotalCustomers(customerRepository.count());
        stats.setTotalItems(itemRepository.count());
        stats.setTotalCategories(categoryRepository.count());
        
        // Calculate total revenue
        Double totalRevenue = allOrderHistory.stream()
                .map(OrderHistory::getTotalAmount)
                .reduce(0.0, Double::sum);
        stats.setTotalRevenue(totalRevenue);
        
        // Calculate today's revenue
        LocalDate today = LocalDate.now();
        Double todayRevenue = allOrderHistory.stream()
                .filter(order -> order.getOrderDate() != null && 
                        order.getOrderDate().toLocalDate().equals(today))
                .map(OrderHistory::getTotalAmount)
                .reduce(0.0, Double::sum);
        stats.setTodayRevenue(todayRevenue);
        
        // Get recent orders (last 5)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
        List<DashboardStats.RecentOrder> recentOrders = allOrders.stream()
                .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
                .limit(5)
                .map(order -> new DashboardStats.RecentOrder(
                        order.getId(),
                        order.getCustomer().getName(),
                        order.getTotalAmount(),
                        order.getStatus(),
                        order.getOrderDate().format(formatter)
                ))
                .collect(Collectors.toList());
        stats.setRecentOrders(recentOrders);
        
        // Top selling items (placeholder - would need order items analysis)
        stats.setTopSellingItems(new ArrayList<>());
        
        return stats;
    }
}
