package com.example.coresystem.controller;

import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<?> login(@RequestBody AuthUser user) {
        if ("root".equals(user.getUsername()) && "admin".equals(user.getPassword())) {
            String token = JwtUtil.generateToken(user.getUsername(), "admin");
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = JwtUtil.validateToken(token);
                return ResponseEntity.ok(Map.of("username", username));
            }
            return ResponseEntity.status(401).body(Map.of("error", "未認証"));
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
