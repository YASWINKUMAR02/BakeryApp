package com.bakery.app.service;

import com.bakery.app.dto.OrderPlacementRequest;
import com.bakery.app.entity.*;
import com.bakery.app.repository.OrderRepository;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final CustomerService customerService;
    private final ItemService itemService;
    private final OrderHistoryService orderHistoryService;
    private final EmailService emailService;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    public OrderService(
            OrderRepository orderRepository,
            CartService cartService,
            CustomerService customerService,
            @Lazy ItemService itemService,
            @Lazy OrderHistoryService orderHistoryService,
            EmailService emailService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.customerService = customerService;
        this.itemService = itemService;
        this.orderHistoryService = orderHistoryService;
        this.emailService = emailService;
    }
    
    @Transactional
    public Order placeOrder(Integer customerId, OrderPlacementRequest request) {
        // STEP 1: Verify payment signature BEFORE creating order
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getPaymentOrderId());
            options.put("razorpay_payment_id", request.getPaymentId());
            options.put("razorpay_signature", request.getPaymentSignature());
            
            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);
            
            if (!isValidSignature) {
                throw new RuntimeException("Payment verification failed. Invalid signature. Please contact support with payment ID: " + request.getPaymentId());
            }
            
            System.out.println("Payment verified successfully for payment ID: " + request.getPaymentId());
            
        } catch (RazorpayException e) {
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
        
        // STEP 2: Proceed with order creation only after payment verification
        Customer customer = customerService.getCustomerById(customerId);
        Cart cart = cartService.getCartByCustomerId(customerId);
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Calculate total amount using stored prices (for cakes) or regular prices
        double totalAmount = cart.getItems().stream()
                .mapToDouble(cartItem -> {
                    double itemPrice;
                    // Use stored price if available (for cakes with weight pricing)
                    if (cartItem.getPriceAtAddition() != null && cartItem.getPriceAtAddition() > 0) {
                        itemPrice = cartItem.getPriceAtAddition();
                    } else {
                        itemPrice = cartItem.getItem().getPrice();
                        // Add ₹30 for eggless items (only if not using stored price)
                        if ("EGGLESS".equals(cartItem.getEggType())) {
                            itemPrice += 30;
                        }
                    }
                    return itemPrice * cartItem.getQuantity();
                })
                .sum();
        
        // Create order
        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);
        order.setStatus("Confirmed");
        order.setCustomerName(request.getCustomerName());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryPhone(request.getDeliveryPhone());
        order.setDeliveryNotes(request.getDeliveryNotes());
        order.setLatitude(request.getLatitude());
        order.setLongitude(request.getLongitude());
        
        // Store payment information
        order.setPaymentId(request.getPaymentId());
        order.setPaymentOrderId(request.getPaymentOrderId());
        order.setPaymentSignature(request.getPaymentSignature());
        order.setPaymentVerified(true);  // Already verified above
        
        Order savedOrder = orderRepository.save(order);
        
        // Create order items from cart items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            // Fetch the item from database to ensure it's a managed entity
            Item managedItem = itemService.getItemById(cartItem.getItem().getId());
            
            // Check stock availability
            if (managedItem.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for item: " + managedItem.getName() + 
                                         ". Available: " + managedItem.getStock() + 
                                         ", Requested: " + cartItem.getQuantity());
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setItem(managedItem);
            orderItem.setItemName(managedItem.getName());  // Store name for history
            orderItem.setQuantity(cartItem.getQuantity());
            
            // Use stored price if available (for cakes with weight pricing), otherwise calculate
            double itemPrice;
            if (cartItem.getPriceAtAddition() != null && cartItem.getPriceAtAddition() > 0) {
                itemPrice = cartItem.getPriceAtAddition();  // Use price stored when added to cart
            } else {
                itemPrice = managedItem.getPrice();
                if ("EGGLESS".equals(cartItem.getEggType())) {
                    itemPrice += 30; // Add ₹30 for eggless
                }
            }
            orderItem.setPrice(itemPrice);
            orderItem.setSelectedWeight(cartItem.getSelectedWeight());  // Store selected weight for cakes
            orderItem.setEggType(cartItem.getEggType());  // Store egg type
            orderItems.add(orderItem);
            
            // Update stock based on egg type
            itemService.updateStock(managedItem.getId(), cartItem.getQuantity(), cartItem.getEggType());
        }
        savedOrder.setOrderItems(orderItems);
        
        // Clear cart after placing order
        cartService.clearCart(customerId);
        
        Order finalOrder = orderRepository.save(savedOrder);
        
        // Send email notifications (async - don't fail order if email fails)
        try {
            emailService.sendOrderConfirmationToCustomer(finalOrder);
            emailService.sendOrderNotificationToAdmin(finalOrder);
        } catch (Exception e) {
            // Log error but don't fail the order
            System.err.println("Failed to send order emails: " + e.getMessage());
        }
        
        return finalOrder;
    }
    
    @Transactional(readOnly = true)
    public List<Order> getOrdersByCustomerId(Integer customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        // Force initialization of orderItems
        orders.forEach(order -> order.getOrderItems().size());
        return orders;
    }
    
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        // Force initialization of orderItems
        orders.forEach(order -> order.getOrderItems().size());
        return orders;
    }
    
    @Transactional(readOnly = true)
    public Order getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        // Force load order items to avoid lazy loading issues
        order.getOrderItems().size();
        return order;
    }
    
    @Transactional(readOnly = true)
    public com.bakery.app.dto.OrderDetailResponse getOrderDetailsById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        // Convert order items to DTO
        List<com.bakery.app.dto.OrderDetailResponse.OrderItemDetail> itemDetails = order.getOrderItems().stream()
                .map(item -> new com.bakery.app.dto.OrderDetailResponse.OrderItemDetail(
                        item.getId(),
                        item.getItemName(),
                        item.getQuantity(),
                        item.getPrice(),
                        "EGGLESS".equalsIgnoreCase(item.getEggType())
                ))
                .collect(java.util.stream.Collectors.toList());
        
        return new com.bakery.app.dto.OrderDetailResponse(
                order.getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getDeliveryAddress(),
                order.getDeliveryPhone(),
                order.getDeliveryNotes(),
                order.getCustomerName(),
                itemDetails
        );
    }
    
    @Transactional
    public Order updateOrderStatus(Integer orderId, String status) {
        System.out.println("Updating order " + orderId + " to status: " + status);
        
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
            
            // Force load order items
            order.getOrderItems().size();
            
            System.out.println("Current order status: " + order.getStatus());
            
            // Update status
            order.setStatus(status);
            Order updatedOrder = orderRepository.save(order);
            
            System.out.println("Order status updated successfully to: " + status);
            
            // Send email for "Out for Delivery" status
            if ("Out for Delivery".equalsIgnoreCase(status)) {
                try {
                    emailService.sendOrderOutForDeliveryToCustomer(updatedOrder);
                    System.out.println("Out for delivery email sent to customer");
                } catch (Exception emailError) {
                    System.err.println("Failed to send out for delivery email: " + emailError.getMessage());
                    // Don't fail the order update if email fails
                }
                return updatedOrder;
            }
            
            // If NOT delivered, just return
            if (!"Delivered".equalsIgnoreCase(status)) {
                return updatedOrder;
            }
            
            // If delivered, move to history and send emails
            System.out.println("Moving order to history...");
            try {
                orderHistoryService.moveOrderToHistory(updatedOrder);
                System.out.println("Order " + orderId + " moved to history successfully");
                
                // Send delivery confirmation emails
                try {
                    emailService.sendOrderDeliveredToCustomer(updatedOrder);
                    emailService.sendOrderDeliveredToAdmin(updatedOrder);
                    System.out.println("Delivery confirmation emails sent successfully");
                } catch (Exception emailError) {
                    System.err.println("Failed to send delivery emails: " + emailError.getMessage());
                    // Don't fail the order update if email fails
                }
            } catch (Exception e) {
                System.err.println("Failed to move order to history: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to move order to history: " + e.getMessage());
            }
            
            return updatedOrder;
            
        } catch (Exception e) {
            System.err.println("Error updating order status: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional
    public void cancelOrder(Integer orderId, Integer customerId) {
        Order order = getOrderById(orderId);
        
        // Verify order belongs to customer
        if (!order.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("You can only cancel your own orders");
        }
        
        // Only allow cancellation of pending orders
        if (!"Pending".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }
        
        // Restore stock for all items
        for (OrderItem orderItem : order.getOrderItems()) {
            if (orderItem.getItem() != null) {
                Item item = orderItem.getItem();
                item.setStock(item.getStock() + orderItem.getQuantity());
                if (item.getStock() > 0) {
                    item.setAvailable(true);
                }
                itemService.updateItem(item.getId(), convertItemToRequest(item));
            }
        }
        
        // Delete the order
        orderRepository.delete(order);
        System.out.println("Order " + orderId + " cancelled and stock restored");
    }
    
    @Transactional
    public Order updateOrderAddress(Integer orderId, Integer customerId, com.bakery.app.dto.OrderAddressUpdateRequest request) {
        Order order = getOrderById(orderId);
        
        // Verify order belongs to customer
        if (!order.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("You can only update your own orders");
        }
        
        // Only allow address updates for Pending and Confirmed orders
        if ("Delivered".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Cannot update address for delivered orders");
        }
        
        // Store old address and coordinates for email notification
        String oldAddress = order.getDeliveryAddress();
        String oldPhone = order.getDeliveryPhone();
        Double oldLatitude = order.getLatitude();
        Double oldLongitude = order.getLongitude();
        
        // Update address
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryPhone(request.getDeliveryPhone());
        if (request.getDeliveryNotes() != null) {
            order.setDeliveryNotes(request.getDeliveryNotes());
        }
        // Update coordinates if provided
        if (request.getLatitude() != null && request.getLongitude() != null) {
            order.setLatitude(request.getLatitude());
            order.setLongitude(request.getLongitude());
        }
        
        Order updatedOrder = orderRepository.save(order);
        
        // Send email notification to admin
        try {
            emailService.sendAddressChangeNotificationToAdmin(updatedOrder, oldAddress, oldPhone, oldLatitude, oldLongitude);
        } catch (Exception e) {
            System.err.println("Failed to send address change notification: " + e.getMessage());
            // Don't fail the update if email fails
        }
        
        return updatedOrder;
    }
    
    private com.bakery.app.dto.ItemRequest convertItemToRequest(Item item) {
        com.bakery.app.dto.ItemRequest request = new com.bakery.app.dto.ItemRequest();
        request.setName(item.getName());
        request.setDescription(item.getDescription());
        request.setPrice(item.getPrice());
        request.setGrams(item.getGrams());
        request.setImageUrl(item.getImageUrl());
        request.setCategoryId(item.getCategory().getId());
        request.setStock(item.getStock());
        request.setFeatured(item.getFeatured());
        request.setAvailable(item.getAvailable());
        return request;
    }
}
