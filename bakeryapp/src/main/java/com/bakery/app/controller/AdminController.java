package com.bakery.app.controller;

import com.bakery.app.dto.ApiResponse;
import com.bakery.app.dto.AuthResponse;
import com.bakery.app.dto.CustomerRegistrationRequest;
import com.bakery.app.dto.LoginRequest;
import com.bakery.app.entity.Admin;
import com.bakery.app.service.AdminService;
import com.bakery.app.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {
    
    private final AdminService adminService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerAdmin(@Valid @RequestBody CustomerRegistrationRequest request) {
        try {
            Admin admin = adminService.registerAdmin(request);
            String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN", admin.getId());
            AuthResponse authResponse = new AuthResponse(token, admin.getId(), admin.getName(), 
                                                         admin.getEmail(), null, "ADMIN");
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Admin registered successfully", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> loginAdmin(@Valid @RequestBody LoginRequest request) {
        try {
            Admin admin = adminService.loginAdmin(request);
            String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN", admin.getId());
            AuthResponse authResponse = new AuthResponse(token, admin.getId(), admin.getName(), 
                                                         admin.getEmail(), null, "ADMIN");
            return ResponseEntity.ok(new ApiResponse(true, "Admin login successful", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getDashboard() {
        return ResponseEntity.ok(new ApiResponse(true, "Welcome to Admin Dashboard"));
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse> getDashboardStats() {
        try {
            return ResponseEntity.ok(new ApiResponse(true, "Dashboard statistics retrieved successfully", 
                    adminService.getDashboardStats()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to retrieve dashboard statistics: " + e.getMessage()));
        }
    }
}
