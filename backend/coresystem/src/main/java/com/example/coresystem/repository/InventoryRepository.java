package com.example.coresystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.coresystem.model.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
}