package com.example.coresystem.repository;

<<<<<<< HEAD
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.coresystem.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
=======
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.coresystem.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * ユーザー名でユーザーを検索
     */
    Optional<User> findByUsername(String username);

    /**
     * ユーザー名とパスワードでユーザーを検索
     */
    Optional<User> findByUsernameAndPassword(String username, String password);

    /**
     * アクティブなユーザーを検索
     */
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.active = true")
    Optional<User> findActiveUserByUsername(@Param("username") String username);

    /**
     * 特定の役割のユーザー数を取得
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.active = true")
    Long countByRole(@Param("role") String role);
}
>>>>>>> 4532de6fabd95f9f9a4655748dc65bed7b0d75ba
