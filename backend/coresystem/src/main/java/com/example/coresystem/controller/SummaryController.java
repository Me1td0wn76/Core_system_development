package com.example.coresystem.controller;

// controller/SummaryController.java
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.coresystem.util.JwtUtil;

@RestController
@RequestMapping("/api")
public class SummaryController {

    @GetMapping("/summary")
    public Map<String, Object> getSummary(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = JwtUtil.validateToken(token); // SECRETは一致している前提

        Map<String, Object> summary = new HashMap<>();
        summary.put("username", username);
        summary.put("sales", 123456);
        summary.put("inventory", 320);
        summary.put("customers", 42);

        return summary;
    }
}
