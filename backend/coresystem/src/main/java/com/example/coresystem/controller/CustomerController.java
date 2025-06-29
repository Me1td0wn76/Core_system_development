package com.example.coresystem.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.coresystem.model.Users;
import com.example.coresystem.repository.UsersRepository;
import com.example.coresystem.util.AuthUtil;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private AuthUtil authUtil;

    @GetMapping("/list")
    public ResponseEntity<?> getCustomers(@RequestHeader("Authorization") String authHeader) {
        if (!authUtil.isValidUser(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        try {
            // データベースから実際のデータを取得
            List<Users> customersList = usersRepository.findAll();

            // データが存在しない場合はダミーデータを返す
            if (customersList.isEmpty()) {
                List<Map<String, Object>> dummyCustomers = new ArrayList<>();
                dummyCustomers
                        .add(Map.of("id", 1, "name", "山田 太郎", "email", "taro@example.com", "phone", "090-1234-5678"));
                dummyCustomers
                        .add(Map.of("id", 2, "name", "佐藤 花子", "email", "hanako@example.com", "phone", "080-2345-6789"));
                dummyCustomers
                        .add(Map.of("id", 3, "name", "鈴木 次郎", "email", "jiro@example.com", "phone", "070-3456-7890"));
                return ResponseEntity.ok(dummyCustomers);
            }

            return ResponseEntity.ok(customersList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch customers: " + e.getMessage()));
        }
    }

    // 顧客追加（管理者のみ）
    @PostMapping("/add")
    public ResponseEntity<?> addCustomer(@RequestHeader("Authorization") String authHeader,
            @RequestBody Users customer) {
        if (!authUtil.isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
        }

        try {
            Users savedCustomer = usersRepository.save(customer);
            return ResponseEntity.ok(savedCustomer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to add customer: " + e.getMessage()));
        }
    }

    // 顧客更新（管理者のみ）
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCustomer(@RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody Users customerData) {
        if (!authUtil.isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
        }

        try {
            Optional<Users> existingCustomer = usersRepository.findById(id);
            if (existingCustomer.isPresent()) {
                Users customer = existingCustomer.get();
                customer.setName(customerData.getName());
                customer.setEmail(customerData.getEmail());
                customer.setPhone(customerData.getPhone());

                Users updatedCustomer = usersRepository.save(customer);
                return ResponseEntity.ok(updatedCustomer);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Customer not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to update customer: " + e.getMessage()));
        }
    }

    // 顧客削除（管理者のみ）
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCustomer(@RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        if (!authUtil.isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
        }

        try {
            if (usersRepository.existsById(id)) {
                usersRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Customer not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to delete customer: " + e.getMessage()));
        }
    }
}
