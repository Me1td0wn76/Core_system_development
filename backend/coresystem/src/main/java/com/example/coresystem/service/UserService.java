package com.example.coresystem.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.coresystem.dto.CreateUserRequest;
import com.example.coresystem.model.User;
import com.example.coresystem.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username) != null;
    }

    public User createUser(CreateUserRequest request) {
        // ユーザー名の重複チェック
        if (existsByUsername(request.getUsername())) {
            throw new RuntimeException("ユーザー名は既に使用されています: " + request.getUsername());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // 実際のプロダクションではパスワードをハッシュ化する
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setActive(1); // デフォルトでアクティブ
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public User authenticate(String username, String password) {
        System.out.println("UserService.authenticate - 検索中のユーザー: " + username);
        User user = userRepository.findByUsername(username);

        if (user == null) {
            System.out.println("UserService.authenticate - ユーザーが見つかりません: " + username);
            return null;
        }

        System.out.println("UserService.authenticate - ユーザー発見: " + user.getUsername());
        System.out.println("UserService.authenticate - DBのパスワード: " + user.getPassword());
        System.out.println("UserService.authenticate - 入力されたパスワード: " + password);
        System.out.println("UserService.authenticate - アクティブ状態: " + user.getActive());

        if (user.getActive() != null && user.getActive() == 1 && password.equals(user.getPassword())) {
            System.out.println("UserService.authenticate - 認証成功: " + username);
            return user;
        }

        System.out.println("UserService.authenticate - 認証失敗: " + username);
        return null;
    }
}