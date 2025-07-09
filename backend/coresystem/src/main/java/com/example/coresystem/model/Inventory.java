package com.example.coresystem.model;

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
@Table(name = "inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD
    private String name;

    private Integer stock;

    // --- ここから追加 ---
=======
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "price")
    private Double price;

    // コンストラクタ
    public Inventory() {
    }

    public Inventory(String name, Integer stock, Double price) {
        this.name = name;
        this.stock = stock;
        this.price = price;
    }

    // Getter and Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

>>>>>>> 4532de6fabd95f9f9a4655748dc65bed7b0d75ba
    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
<<<<<<< HEAD
    // --- ここまで追加 ---

    // 他のgetter/setterも必要に応じて追加
}
=======

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
>>>>>>> 4532de6fabd95f9f9a4655748dc65bed7b0d75ba
