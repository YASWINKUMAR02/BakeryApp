package com.bakery.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    
    // Sales Overview
    private SalesOverview salesOverview;
    
    // Revenue Data
    private RevenueData revenueData;
    
    // Popular Items
    private List<PopularItem> popularItems;
    
    // Customer Insights
    private CustomerInsights customerInsights;
    
    // Low Stock Items
    private List<LowStockItem> lowStockItems;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalesOverview {
        private Long totalOrders;
        private Long todayOrders;
        private Long weekOrders;
        private Long monthOrders;
        private Double totalRevenue;
        private Double todayRevenue;
        private Double weekRevenue;
        private Double monthRevenue;
        private Double averageOrderValue;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueData {
        private List<DailyRevenue> daily;
        private List<WeeklyRevenue> weekly;
        private List<MonthlyRevenue> monthly;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyRevenue {
        private String date;
        private Double revenue;
        private Long orders;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyRevenue {
        private String week;
        private Double revenue;
        private Long orders;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenue {
        private String month;
        private Double revenue;
        private Long orders;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PopularItem {
        private Integer itemId;
        private String itemName;
        private Long totalQuantitySold;
        private Double totalRevenue;
        private Long orderCount;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerInsights {
        private Long totalCustomers;
        private Long repeatCustomers;
        private Double repeatCustomerRate;
        private List<TopCustomer> topCustomers;
        private Long newCustomersThisMonth;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopCustomer {
        private Integer customerId;
        private String customerName;
        private String email;
        private Long totalOrders;
        private Double totalSpent;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LowStockItem {
        private Integer itemId;
        private String itemName;
        private Integer currentStock;
        private Integer threshold;
        private String category;
    }
}
