package com.example.coresystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.coresystem.model.Sales;

public interface SalesRepository extends JpaRepository<Sales, Long> {
    @Query("SELECT MONTH(s.saleDate) as month, SUM(s.amount) as total FROM Sales s WHERE YEAR(s.saleDate) = :year GROUP BY MONTH(s.saleDate) ORDER BY month")
    List<Object[]> getMonthlySales(int year);

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Sales s")
    Double getTotalSales();
}
