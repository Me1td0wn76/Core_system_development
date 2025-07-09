package com.example.coresystem.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.coresystem.repository.InventoryRepository;
import com.example.coresystem.repository.SalesRepository;
import com.example.coresystem.repository.UsersRepository;
import com.example.coresystem.util.JwtUtil;

@RestController
@RequestMapping("/api")
public class SummaryController {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("username", "guest");
        summary.put("sales", 123456);
        summary.put("inventory", 320);
        summary.put("customers", 42);
        summary.put("username", username);

        // 実際のデータベースからデータを取得
        try {
            Double totalSales = salesRepository.getTotalSales();
            Long totalStock = inventoryRepository.getTotalStock();
            Long customerCount = usersRepository.getUsersCount();

            summary.put("sales", totalSales != null ? totalSales.intValue() : 0);
            summary.put("inventory", totalStock != null ? totalStock.intValue() : 0);
            summary.put("customers", customerCount != null ? customerCount.intValue() : 0);
        } catch (Exception e) {
            // データベース接続エラーの場合はダミーデータを使用
            summary.put("sales", 123456);
            summary.put("inventory", 320);
            summary.put("customers", 42);
        }

        return summary;
    }
}
