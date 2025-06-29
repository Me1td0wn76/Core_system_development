package com.example.coresystem.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.coresystem.model.AuthUser;
import com.example.coresystem.model.User;
import com.example.coresystem.repository.UserRepository;
import com.example.coresystem.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthUser authUser) {
        String username = authUser.getUsername();
        String password = authUser.getPassword();

        System.out.println("Login attempt - Username: " + username);

        // デフォルトの管理者アカウント（開発用）
        if ("root".equals(username) && "admin".equals(password)) {
            String token = JwtUtil.generateToken(username);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("role", "admin");
            System.out.println("Login successful - Default admin account");
            return ResponseEntity.ok(response);
        }

        // データベースからユーザーを検索
        try {
            System.out.println("Searching user in database...");
            Optional<User> userOpt = userRepository.findActiveUserByUsername(username);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("User found - Username: " + user.getUsername() +
                        ", Role: " + user.getRole() +
                        ", Active: " + user.getActive());

                // パスワード確認（デバッグ用 - 本番では削除）
                System.out.println("Expected password: " + user.getPassword());
                System.out.println("Provided password: " + password);

                if (password.equals(user.getPassword())) {
                    String token = JwtUtil.generateToken(username);

                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("username", user.getUsername());
                    response.put("role", user.getRole());
                    response.put("email", user.getEmail());

                    System.out.println("Login successful - Database user");
                    return ResponseEntity.ok(response);
                } else {
                    System.out.println("Password mismatch");
                }
            } else {
                System.out.println("User not found in database");
            }
        } catch (Exception e) {
            // データベースエラーの場合はログに記録
            System.err.println("Database error during login: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("Login failed for username: " + username);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String token = authHeader.substring(7);
            String username = JwtUtil.validateToken(token);

            // デフォルトの管理者アカウント
            if ("root".equals(username)) {
                Map<String, Object> response = new HashMap<>();
                response.put("username", username);
                response.put("role", "admin");
                return ResponseEntity.ok(response);
            }

            // データベースからユーザー情報を取得
            Optional<User> userOpt = userRepository.findActiveUserByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("username", user.getUsername());
                response.put("role", user.getRole());
                response.put("email", user.getEmail());

                return ResponseEntity.ok(response);
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // デバッグ用エンドポイント（開発時のみ使用）
    @GetMapping("/debug/users")
    public ResponseEntity<?> debugUsers() {
        try {
            java.util.List<User> users = userRepository.findAll();
            java.util.List<Map<String, Object>> userList = new java.util.ArrayList<>();

            for (User user : users) {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("username", user.getUsername());
                userInfo.put("role", user.getRole());
                userInfo.put("email", user.getEmail());
                userInfo.put("active", user.getActive());
                // パスワードは表示しない（セキュリティ上の理由）
                userList.add(userInfo);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("userCount", users.size());
            response.put("users", userList);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Database error: " + e.getMessage()));
        }
    }
}
