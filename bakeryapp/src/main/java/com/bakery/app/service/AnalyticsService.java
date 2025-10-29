package com.bakery.app.service;

import com.bakery.app.dto.AnalyticsDTO;
import com.bakery.app.entity.Order;
import com.bakery.app.entity.OrderHistory;
import com.bakery.app.entity.OrderItem;
import com.bakery.app.entity.OrderHistoryItem;
import com.bakery.app.entity.Customer;
import com.bakery.app.entity.Item;
import com.bakery.app.repository.OrderRepository;
import com.bakery.app.repository.OrderHistoryRepository;
import com.bakery.app.repository.CustomerRepository;
import com.bakery.app.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderHistoryRepository orderHistoryRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private ItemRepository itemRepository;
    
    public AnalyticsDTO getAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();
        
        // Get all orders (current + history)
        List<Order> currentOrders = orderRepository.findAll();
        List<OrderHistory> historyOrders = orderHistoryRepository.findAll();
        
        analytics.setSalesOverview(calculateSalesOverview(currentOrders, historyOrders));
        analytics.setRevenueData(calculateRevenueData(currentOrders, historyOrders));
        analytics.setPopularItems(calculatePopularItems(currentOrders, historyOrders));
        analytics.setCustomerInsights(calculateCustomerInsights(currentOrders, historyOrders));
        analytics.setLowStockItems(calculateLowStockItems());
        
        return analytics;
    }
    
    private AnalyticsDTO.SalesOverview calculateSalesOverview(List<Order> currentOrders, List<OrderHistory> historyOrders) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime weekStart = now.minus(7, ChronoUnit.DAYS);
        LocalDateTime monthStart = now.minus(30, ChronoUnit.DAYS);
        
        // Combine all orders
        List<OrderData> allOrders = new ArrayList<>();
        currentOrders.forEach(o -> allOrders.add(new OrderData(o.getOrderDate(), o.getTotalAmount())));
        historyOrders.forEach(o -> allOrders.add(new OrderData(o.getOrderDate(), o.getTotalAmount())));
        
        long totalOrders = allOrders.size();
        long todayOrders = allOrders.stream().filter(o -> o.date.isAfter(todayStart)).count();
        long weekOrders = allOrders.stream().filter(o -> o.date.isAfter(weekStart)).count();
        long monthOrders = allOrders.stream().filter(o -> o.date.isAfter(monthStart)).count();
        
        double totalRevenue = allOrders.stream().mapToDouble(o -> o.amount).sum();
        double todayRevenue = allOrders.stream().filter(o -> o.date.isAfter(todayStart)).mapToDouble(o -> o.amount).sum();
        double weekRevenue = allOrders.stream().filter(o -> o.date.isAfter(weekStart)).mapToDouble(o -> o.amount).sum();
        double monthRevenue = allOrders.stream().filter(o -> o.date.isAfter(monthStart)).mapToDouble(o -> o.amount).sum();
        
        double avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        return new AnalyticsDTO.SalesOverview(
            totalOrders, todayOrders, weekOrders, monthOrders,
            totalRevenue, todayRevenue, weekRevenue, monthRevenue, avgOrderValue
        );
    }
    
    private AnalyticsDTO.RevenueData calculateRevenueData(List<Order> currentOrders, List<OrderHistory> historyOrders) {
        List<OrderData> allOrders = new ArrayList<>();
        currentOrders.forEach(o -> allOrders.add(new OrderData(o.getOrderDate(), o.getTotalAmount())));
        historyOrders.forEach(o -> allOrders.add(new OrderData(o.getOrderDate(), o.getTotalAmount())));
        
        // Daily revenue (last 30 days)
        List<AnalyticsDTO.DailyRevenue> dailyRevenue = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 29; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
            
            List<OrderData> dayOrders = allOrders.stream()
                .filter(o -> o.date.isAfter(startOfDay) && o.date.isBefore(endOfDay))
                .collect(Collectors.toList());
            
            double revenue = dayOrders.stream().mapToDouble(o -> o.amount).sum();
            dailyRevenue.add(new AnalyticsDTO.DailyRevenue(
                date.format(DateTimeFormatter.ofPattern("MMM dd")),
                revenue,
                (long) dayOrders.size()
            ));
        }
        
        // Weekly revenue (last 12 weeks)
        List<AnalyticsDTO.WeeklyRevenue> weeklyRevenue = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            LocalDateTime weekStart = LocalDateTime.now().minus(i * 7, ChronoUnit.DAYS);
            LocalDateTime weekEnd = weekStart.plus(7, ChronoUnit.DAYS);
            
            List<OrderData> weekOrders = allOrders.stream()
                .filter(o -> o.date.isAfter(weekStart) && o.date.isBefore(weekEnd))
                .collect(Collectors.toList());
            
            double revenue = weekOrders.stream().mapToDouble(o -> o.amount).sum();
            weeklyRevenue.add(new AnalyticsDTO.WeeklyRevenue(
                "Week " + (12 - i),
                revenue,
                (long) weekOrders.size()
            ));
        }
        
        // Monthly revenue (last 12 months)
        List<AnalyticsDTO.MonthlyRevenue> monthlyRevenue = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            LocalDate monthStart = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1);
            
            List<OrderData> monthOrders = allOrders.stream()
                .filter(o -> {
                    LocalDate orderDate = o.date.toLocalDate();
                    return !orderDate.isBefore(monthStart) && orderDate.isBefore(monthEnd);
                })
                .collect(Collectors.toList());
            
            double revenue = monthOrders.stream().mapToDouble(o -> o.amount).sum();
            monthlyRevenue.add(new AnalyticsDTO.MonthlyRevenue(
                monthStart.format(DateTimeFormatter.ofPattern("MMM yyyy")),
                revenue,
                (long) monthOrders.size()
            ));
        }
        
        return new AnalyticsDTO.RevenueData(dailyRevenue, weeklyRevenue, monthlyRevenue);
    }
    
    private List<AnalyticsDTO.PopularItem> calculatePopularItems(List<Order> currentOrders, List<OrderHistory> historyOrders) {
        Map<Integer, ItemStats> itemStatsMap = new HashMap<>();
        
        // Process current orders
        for (Order order : currentOrders) {
            for (OrderItem item : order.getOrderItems()) {
                Integer itemId = item.getItem() != null ? item.getItem().getId() : null;
                String itemName = item.getItem() != null ? item.getItem().getName() : item.getItemName();
                
                if (itemId != null) {
                    itemStatsMap.putIfAbsent(itemId, new ItemStats(itemId, itemName));
                    ItemStats stats = itemStatsMap.get(itemId);
                    stats.quantity += item.getQuantity();
                    stats.revenue += item.getPrice() * item.getQuantity();
                    stats.orderCount++;
                }
            }
        }
        
        // Process history orders
        for (OrderHistory order : historyOrders) {
            for (OrderHistoryItem item : order.getOrderItems()) {
                String itemName = item.getItemName();
                // For history, we use name hashcode as itemId since we don't have Item reference
                Integer itemId = itemName.hashCode();
                
                itemStatsMap.putIfAbsent(itemId, new ItemStats(itemId, itemName));
                ItemStats stats = itemStatsMap.get(itemId);
                stats.quantity += item.getQuantity();
                stats.revenue += item.getPrice() * item.getQuantity();
                stats.orderCount++;
            }
        }
        
        return itemStatsMap.values().stream()
            .sorted((a, b) -> Long.compare(b.quantity, a.quantity))
            .limit(10)
            .map(stats -> new AnalyticsDTO.PopularItem(
                stats.itemId,
                stats.itemName,
                stats.quantity,
                stats.revenue,
                stats.orderCount
            ))
            .collect(Collectors.toList());
    }
    
    private AnalyticsDTO.CustomerInsights calculateCustomerInsights(List<Order> currentOrders, List<OrderHistory> historyOrders) {
        Map<Integer, CustomerStats> customerStatsMap = new HashMap<>();
        
        // Process current orders
        for (Order order : currentOrders) {
            Integer customerId = order.getCustomer().getId();
            customerStatsMap.putIfAbsent(customerId, new CustomerStats(
                customerId,
                order.getCustomer().getName(),
                order.getCustomer().getEmail()
            ));
            CustomerStats stats = customerStatsMap.get(customerId);
            stats.orderCount++;
            stats.totalSpent += order.getTotalAmount();
        }
        
        // Process history orders
        for (OrderHistory order : historyOrders) {
            Integer customerId = order.getCustomerId();
            customerStatsMap.putIfAbsent(customerId, new CustomerStats(
                customerId,
                order.getCustomerName(),
                "" // Email not stored in OrderHistory
            ));
            CustomerStats stats = customerStatsMap.get(customerId);
            stats.orderCount++;
            stats.totalSpent += order.getTotalAmount();
        }
        
        long totalCustomers = customerRepository.count();
        long repeatCustomers = customerStatsMap.values().stream().filter(c -> c.orderCount > 1).count();
        double repeatRate = totalCustomers > 0 ? (repeatCustomers * 100.0 / totalCustomers) : 0;
        
        List<AnalyticsDTO.TopCustomer> topCustomers = customerStatsMap.values().stream()
            .sorted((a, b) -> Double.compare(b.totalSpent, a.totalSpent))
            .limit(10)
            .map(stats -> new AnalyticsDTO.TopCustomer(
                stats.customerId,
                stats.customerName,
                stats.email,
                stats.orderCount,
                stats.totalSpent
            ))
            .collect(Collectors.toList());
        
        // New customers this month (based on first order)
        LocalDateTime monthStart = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        long newCustomers = customerStatsMap.values().stream()
            .filter(c -> c.orderCount == 1)
            .count();
        
        return new AnalyticsDTO.CustomerInsights(
            totalCustomers,
            repeatCustomers,
            repeatRate,
            topCustomers,
            newCustomers
        );
    }
    
    private List<AnalyticsDTO.LowStockItem> calculateLowStockItems() {
        int threshold = 10; // Low stock threshold
        
        return itemRepository.findAll().stream()
            .filter(item -> item.getStock() != null && item.getStock() < threshold)
            .map(item -> new AnalyticsDTO.LowStockItem(
                item.getId(),
                item.getName(),
                item.getStock(),
                threshold,
                item.getCategory() != null ? item.getCategory().getName() : "N/A"
            ))
            .sorted(Comparator.comparingInt(AnalyticsDTO.LowStockItem::getCurrentStock))
            .collect(Collectors.toList());
    }
    
    // Helper classes
    private static class OrderData {
        LocalDateTime date;
        Double amount;
        
        OrderData(LocalDateTime date, Double amount) {
            this.date = date;
            this.amount = amount;
        }
    }
    
    private static class ItemStats {
        Integer itemId;
        String itemName;
        Long quantity = 0L;
        Double revenue = 0.0;
        Long orderCount = 0L;
        
        ItemStats(Integer itemId, String itemName) {
            this.itemId = itemId;
            this.itemName = itemName;
        }
    }
    
    private static class CustomerStats {
        Integer customerId;
        String customerName;
        String email;
        Long orderCount = 0L;
        Double totalSpent = 0.0;
        
        CustomerStats(Integer customerId, String customerName, String email) {
            this.customerId = customerId;
            this.customerName = customerName;
            this.email = email;
        }
    }
}
