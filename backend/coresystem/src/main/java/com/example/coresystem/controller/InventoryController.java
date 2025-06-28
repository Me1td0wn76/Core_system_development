package com.example.coresystem.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @GetMapping("/list")
    public List<Map<String, Object>> getInventoryList() {
        List<Map<String, Object>> data = new ArrayList<>();

        data.add(Map.of("id", 1, "name", "りんご", "stock", 25));
        data.add(Map.of("id", 2, "name", "バナナ", "stock", 3));
        data.add(Map.of("id", 3, "name", "みかん", "stock", 0));
        data.add(Map.of("id", 4, "name", "ぶどう", "stock", 12));

        return data;
    }
}
