package com.example.coresystem.controller;

import com.example.coresystem.model.Inventory;
import com.example.coresystem.repository.InventoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryRepository repo;

    public InventoryController(InventoryRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/list")
    public List<Inventory> list() {
        return repo.findAll();
    }

    @PutMapping("/{id}")
    public Inventory update(@PathVariable Long id, @RequestBody Inventory update) {
        Inventory inv = repo.findById(id).orElseThrow();
        inv.setStock(update.getStock());
        return repo.save(inv);
    }
}
