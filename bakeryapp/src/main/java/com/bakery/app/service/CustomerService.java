package com.bakery.app.service;

import com.bakery.app.dto.CustomerRegistrationRequest;
import com.bakery.app.dto.CustomerUpdateRequest;
import com.bakery.app.dto.LoginRequest;
import com.bakery.app.dto.PasswordUpdateRequest;
import com.bakery.app.entity.Cart;
import com.bakery.app.entity.Customer;
import com.bakery.app.repository.CartRepository;
import com.bakery.app.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public Customer registerCustomer(CustomerRegistrationRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        
        Customer savedCustomer = customerRepository.save(customer);
        
        // Create cart for customer
        Cart cart = new Cart();
        cart.setCustomer(savedCustomer);
        cartRepository.save(cart);
        
        return savedCustomer;
    }
    
    public Customer loginCustomer(LoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not exists. Please check your email or sign up."));
        
        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid password. Please try again.");
        }
        
        return customer;
    }
    
    public Customer getCustomerById(Integer id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }
    
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    public Customer updateCustomer(Integer id, CustomerUpdateRequest request) {
        Customer customer = getCustomerById(id);
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        
        return customerRepository.save(customer);
    }
    
    @Transactional
    public void updatePassword(Integer id, PasswordUpdateRequest request) {
        Customer customer = getCustomerById(id);
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), customer.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update to new password
        customer.setPassword(passwordEncoder.encode(request.getNewPassword()));
        customerRepository.save(customer);
    }
}
