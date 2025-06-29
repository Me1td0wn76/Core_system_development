package com.example.coresystem.controller;

import java.util.ArrayList;
import java.util.HashMap;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.coresystem.model.Sales;
import com.example.coresystem.repository.SalesRepository;
import com.example.coresystem.util.JwtUtil;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    @Autowired
    private SalesRepository salesRepository;

    @GetMapping("/chart")
    public List<Map<String, Object>> getSalesChart(@RequestParam int year) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            Map<String, Object> data = new HashMap<>();
            data.put("month", i + "月");
            data.put("sales", 100000 + i * 10000 + year); // ダミーデータ
            data.put("profit", 30000 + i * 3000 + year); // ダミーデータ
            list.add(data);
        }
        return list;
    }

    // 売上一覧取得
    @GetMapping("/list")
    public ResponseEntity<?> getSalesList(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            JwtUtil.validateToken(token);
            
            List<Sales> salesList = salesRepository.findAll();
            return ResponseEntity.ok(salesList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
    }

    // 売上追加（管理者のみ）
    @PostMapping("/add")
    public ResponseEntity<?> addSales(@RequestHeader("Authorization") String authHeader, 
                                     @RequestBody Sales sales) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = JwtUtil.validateToken(token);
            
            // 管理者チェック（簡易版）
            if (!isAdmin(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
            }
            
            Sales savedSales = salesRepository.save(sales);
            return ResponseEntity.ok(Map.of("message", "Sales added successfully", "sales", savedSales));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
    }

    // 売上更新（管理者のみ）
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSales(@RequestHeader("Authorization") String authHeader,
                                        @PathVariable Long id,
                                        @RequestBody Sales salesData) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = JwtUtil.validateToken(token);
            
            if (!isAdmin(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
            }
            
            Optional<Sales> existingSales = salesRepository.findById(id);
            if (existingSales.isPresent()) {
                Sales sales = existingSales.get();
                sales.setAmount(salesData.getAmount());
                sales.setProfit(salesData.getProfit());
                sales.setProductName(salesData.getProductName());
                sales.setSaleDate(salesData.getSaleDate());
                
                Sales updatedSales = salesRepository.save(sales);
                return ResponseEntity.ok(Map.of("message", "Sales updated successfully", "sales", updatedSales));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Sales not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
    }

    // 売上削除（管理者のみ）
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSales(@RequestHeader("Authorization") String authHeader,
                                        @PathVariable Long id) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = JwtUtil.validateToken(token);
            
            if (!isAdmin(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
            }
            
            if (salesRepository.existsById(id)) {
                salesRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "Sales deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Sales not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
    }

    // 管理者チェックのヘルパーメソッド
    private boolean isAdmin(String username) {
        return "root".equals(username) || "admin".equals(username);
        // TODO: データベースから実際の役割を確認する実装に変更
    }
}
