package com.example.coresystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.coresystem.model.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM Inventory i")
    Long getTotalStock();
}
