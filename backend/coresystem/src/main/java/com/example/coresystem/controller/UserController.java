package com.example.coresystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.coresystem.dto.CreateUserRequest;
import com.example.coresystem.model.User;
import com.example.coresystem.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/list")
    public ResponseEntity<List<User>> list() {
        try {
            List<User> users = userService.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody CreateUserRequest request) {
        try {
            // バリデーション
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("ユーザー名は必須です"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("パスワードは必須です"));
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("メールアドレスは必須です"));
            }
            if (request.getRole() == null ||
                    (!request.getRole().equals("admin") && !request.getRole().equals("staff"))) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("権限は admin または staff である必要があります"));
            }

            User user = userService.createUser(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ユーザー作成中にエラーが発生しました"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            if (!userService.findById(id).isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // 管理者の削除を防ぐ
            User user = userService.findById(id).get();
            if ("admin".equals(user.getRole())) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("管理者ユーザーは削除できません"));
            }

            userService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ユーザー削除中にエラーが発生しました"));
        }
    }

    // エラーレスポンス用のクラス
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}