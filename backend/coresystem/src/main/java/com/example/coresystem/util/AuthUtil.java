package com.example.coresystem.util;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.coresystem.model.User;
import com.example.coresystem.repository.UserRepository;

@Component
public class AuthUtil {

    @Autowired
    private UserRepository userRepository;

    /**
     * JWTトークンからユーザー情報を取得
     */
    public Optional<User> getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Optional.empty();
        }

        try {
            String token = authHeader.substring(7);
            String username = JwtUtil.validateToken(token);

            // デフォルトの管理者アカウント
            if ("root".equals(username)) {
                User adminUser = new User();
                adminUser.setUsername("root");
                adminUser.setRole("admin");
                adminUser.setEmail("admin@example.com");
                adminUser.setActive(1);
                return Optional.of(adminUser);
            }

            // データベースからユーザー情報を取得
            return userRepository.findActiveUserByUsername(username);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * ユーザーが管理者権限を持っているかチェック
     */
    public boolean isAdmin(String authHeader) {
        Optional<User> userOpt = getUserFromToken(authHeader);
        return userOpt.isPresent() && "admin".equals(userOpt.get().getRole());
    }

    /**
     * ユーザーがアクティブかつ有効なユーザーかチェック
     */
    public boolean isValidUser(String authHeader) {
        Optional<User> userOpt = getUserFromToken(authHeader);
        return userOpt.isPresent() && userOpt.get().getActive() != null && userOpt.get().getActive() == 1;
    }
}
