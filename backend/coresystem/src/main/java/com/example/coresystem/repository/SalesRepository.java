package com.example.coresystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.coresystem.model.Sales;

@Repository
public interface SalesRepository extends JpaRepository<Sales, Long> {

    @Query("SELECT SUM(s.amount) FROM Sales s")
    Double getTotalSales();

    @Query("SELECT SUM(s.profit) FROM Sales s")
    Double getTotalProfit();

    @Query("SELECT COUNT(s) FROM Sales s")
    Long getSalesCount();
}
