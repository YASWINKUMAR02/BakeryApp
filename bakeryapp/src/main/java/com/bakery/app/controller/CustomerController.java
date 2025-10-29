package com.bakery.app.controller;

import com.bakery.app.dto.ApiResponse;
import com.bakery.app.dto.AuthResponse;
import com.bakery.app.dto.CustomerRegistrationRequest;
import com.bakery.app.dto.CustomerUpdateRequest;
import com.bakery.app.dto.LoginRequest;
import com.bakery.app.dto.PasswordUpdateRequest;
import com.bakery.app.entity.Customer;
import com.bakery.app.service.CustomerService;
import com.bakery.app.service.PasswordResetService;
import com.bakery.app.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CustomerController {
    
    private final CustomerService customerService;
    private final JwtUtil jwtUtil;
    private final PasswordResetService passwordResetService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerCustomer(@Valid @RequestBody CustomerRegistrationRequest request) {
        try {
            Customer customer = customerService.registerCustomer(request);
            String token = jwtUtil.generateToken(customer.getEmail(), "CUSTOMER", customer.getId());
            AuthResponse authResponse = new AuthResponse(token, customer.getId(), customer.getName(), 
                                                         customer.getEmail(), customer.getPhone(), "CUSTOMER");
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Customer registered successfully", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> loginCustomer(@Valid @RequestBody LoginRequest request) {
        try {
            Customer customer = customerService.loginCustomer(request);
            String token = jwtUtil.generateToken(customer.getEmail(), "CUSTOMER", customer.getId());
            AuthResponse authResponse = new AuthResponse(token, customer.getId(), customer.getName(), 
                                                         customer.getEmail(), customer.getPhone(), "CUSTOMER");
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCustomerById(@PathVariable Integer id) {
        try {
            Customer customer = customerService.getCustomerById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Customer retrieved successfully", customer));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(new ApiResponse(true, "Customers retrieved successfully", customers));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCustomer(@PathVariable Integer id, 
                                                      @Valid @RequestBody CustomerUpdateRequest request) {
        try {
            Customer customer = customerService.updateCustomer(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Customer updated successfully", customer));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/password")
    public ResponseEntity<ApiResponse> updatePassword(@PathVariable Integer id,
                                                      @Valid @RequestBody PasswordUpdateRequest request) {
        try {
            customerService.updatePassword(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            passwordResetService.createPasswordResetToken(email);
            return ResponseEntity.ok(new ApiResponse(true, "Password reset link sent to your email", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            
            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Password must be at least 6 characters long", null));
            }
            
            passwordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok(new ApiResponse(true, "Password reset successful", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }
}
