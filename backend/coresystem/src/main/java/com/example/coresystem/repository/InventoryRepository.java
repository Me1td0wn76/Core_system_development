package com.example.coresystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD

import com.example.coresystem.model.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
}
=======
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
>>>>>>> 4532de6fabd95f9f9a4655748dc65bed7b0d75ba
