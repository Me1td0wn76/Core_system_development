package com.example.coresystem.model;

import java.time.LocalDateTime;

<<<<<<< HEAD
=======
import jakarta.persistence.Column;
>>>>>>> 4532de6fabd95f9f9a4655748dc65bed7b0d75ba
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sales")
public class Sales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD
    private LocalDateTime salesDate;
    private Double amount;

    // getter/setter
}
=======
    @Column(name = "amount")
    private Double amount;

    @Column(name = "profit")
    private Double profit;

    @Column(name = "sale_date")
    private LocalDateTime saleDate;

    @Column(name = "product_name")
    private String productName;

    // コンストラクタ
    public Sales() {
    }

    public Sales(Double amount, Double profit, LocalDateTime saleDate, String productName) {
        this.amount = amount;
        this.profit = profit;
        this.saleDate = saleDate;
        this.productName = productName;
    }

    // Getter and Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}
>>>>>>> 4532de6fabd95f9f9a4655748dc65bed7b0d75ba
