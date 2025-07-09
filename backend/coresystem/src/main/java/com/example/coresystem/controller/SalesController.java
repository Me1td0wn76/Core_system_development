package com.example.coresystem.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

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
}