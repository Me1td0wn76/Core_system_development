package com.example.coresystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.coresystem.model.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("SELECT COUNT(i) FROM Inventory i")
    Long getInventoryCount();

    @Query("SELECT SUM(i.stock) FROM Inventory i")
    Long getTotalStock();
}
