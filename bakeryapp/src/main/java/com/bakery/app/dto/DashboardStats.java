package com.bakery.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Long totalOrders;
    private Long pendingOrders;
    private Long deliveredOrders;
    private Long totalCustomers;
    private Long totalItems;
    private Long totalCategories;
    private Double totalRevenue;
    private Double todayRevenue;
    private List<RecentOrder> recentOrders;
    private List<TopSellingItem> topSellingItems;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentOrder {
        private Integer orderId;
        private String customerName;
        private Double totalAmount;
        private String status;
        private String orderDate;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopSellingItem {
        private String itemName;
        private Long totalSold;
        private Double revenue;
    }
}
