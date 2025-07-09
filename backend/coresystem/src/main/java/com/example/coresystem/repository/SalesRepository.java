package com.example.coresystem.repository;

<<<<<<< HEAD
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.coresystem.model.Sales;

public interface SalesRepository extends JpaRepository<Sales, Long> {
    @Query("SELECT MONTH(s.salesDate) as month, SUM(s.amount) as total FROM Sales s WHERE YEAR(s.salesDate) = :year GROUP BY MONTH(s.salesDate) ORDER BY month")
    List<Object[]> getMonthlySales(int year);
}
=======
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
>>>>>>> 4532de6fabd95f9f9a4655748dc65bed7b0d75ba
