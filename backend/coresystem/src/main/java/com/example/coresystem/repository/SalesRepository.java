package com.example.coresystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.coresystem.model.Sales;

public interface SalesRepository extends JpaRepository<Sales, Long> {
    @Query("SELECT MONTH(s.salesDate) as month, SUM(s.amount) as total FROM Sales s WHERE YEAR(s.salesDate) = :year GROUP BY MONTH(s.salesDate) ORDER BY month")
    List<Object[]> getMonthlySales(int year);
}