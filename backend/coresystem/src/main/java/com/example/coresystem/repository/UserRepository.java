package com.example.coresystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.coresystem.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}