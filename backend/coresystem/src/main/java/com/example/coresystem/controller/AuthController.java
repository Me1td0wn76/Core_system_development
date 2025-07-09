package com.example.coresystem.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.coresystem.model.User;
import com.example.coresystem.service.UserService;
import com.example.coresystem.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        // デバッグ用ログ
        System.out.println("受信したusername: " + username);
        System.out.println("受信したpassword: " + password);

        // データベースから認証
        User user = userService.authenticate(username, password);
        if (user != null) {
            String token = JwtUtil.generateToken(username, user.getRole());
            return ResponseEntity.ok(Map.of("token", token, "username", username, "role", user.getRole()));
        }

        System.out.println("認証失敗: username=" + username + ", password=" + password);
        return ResponseEntity.status(401).body(Map.of("error", "認証失敗"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = JwtUtil.getUsername(token);
                String role = JwtUtil.getRole(token);
                return ResponseEntity.ok(Map.of("username", username, "role", role));
            } catch (Exception e) {
                return ResponseEntity.status(401).body(Map.of("error", "トークン不正"));
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "未認証"));
    }
}
