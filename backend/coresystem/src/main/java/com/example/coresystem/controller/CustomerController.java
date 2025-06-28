package com.example.coresystem.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// This code is part of a Spring Boot application that provides a REST API endpoint
// to retrieve a list of customers. Each customer is represented as a map with
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @GetMapping("/list")
    public List<Map<String, Object>> getCustomers() {
        List<Map<String, Object>> customers = new ArrayList<>();

        customers.add(Map.of("id", 1, "name", "山田 太郎", "email", "taro@example.com", "phone", "090-1234-5678"));
        customers.add(Map.of("id", 2, "name", "佐藤 花子", "email", "hanako@example.com", "phone", "080-2345-6789"));
        customers.add(Map.of("id", 3, "name", "鈴木 次郎", "email", "jiro@example.com", "phone", "070-3456-7890"));

        return customers;
    }
}
