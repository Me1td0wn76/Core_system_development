package com.example.coresystem.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.coresystem.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (("root".equals(username) && "root".equals(password)) ||
                ("admin".equals(username) && "admin".equals(password))) {
            String token = JwtUtil.generateToken(username, password);
            return ResponseEntity.ok(Map.of("token", token, "username", username));
        }
        return ResponseEntity.status(401).body(Map.of("error", "認証失敗"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = JwtUtil.getUsername(token);
                return ResponseEntity.ok(Map.of("username", username, "role", "admin"));
            } catch (Exception e) {
                return ResponseEntity.status(401).body(Map.of("error", "トークン不正"));
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "未認証"));
    }
}
