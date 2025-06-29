package com.example.coresystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.coresystem.model.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    @Query("SELECT COUNT(u) FROM Users u")
    Long getUsersCount();
}
