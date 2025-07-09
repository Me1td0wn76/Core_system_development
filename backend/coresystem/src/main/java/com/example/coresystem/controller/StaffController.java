package com.example.coresystem.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.coresystem.model.User;
import com.example.coresystem.repository.UserRepository;
import com.example.coresystem.util.AuthUtil;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthUtil authUtil;

    // スタッフ一覧取得（管理者のみ）
    @GetMapping("/list")
    public ResponseEntity<?> getStaffList(@RequestHeader("Authorization") String authHeader) {
        if (!authUtil.isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
        }

        try {
            List<User> staffList = userRepository.findAll();

            // パスワードを除外してレスポンス
            List<Map<String, Object>> staffResponse = new ArrayList<>();
            for (User staff : staffList) {
                Map<String, Object> staffMap = new HashMap<>();
                staffMap.put("id", staff.getId());
                staffMap.put("username", staff.getUsername());
                staffMap.put("role", staff.getRole());
                staffMap.put("email", staff.getEmail() != null ? staff.getEmail() : "");
                staffMap.put("active", staff.getActive());
                staffResponse.add(staffMap);
            }

            return ResponseEntity.ok(staffResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch staff list: " + e.getMessage()));
        }
    }

    // スタッフ追加（管理者のみ）
    @PostMapping("/add")
    public ResponseEntity<?> addStaff(@RequestHeader("Authorization") String authHeader,
            @RequestBody User staff) {
        if (!authUtil.isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
        }

        try {
            // デフォルト値設定
            if (staff.getRole() == null || staff.getRole().isEmpty()) {
                staff.setRole("staff");
            }
            if (staff.getActive() == null) {
                staff.setActive(true);
            }

            User savedStaff = userRepository.save(staff);

            // パスワードを除外してレスポンス
            Map<String, Object> staffMap = new HashMap<>();
            staffMap.put("id", savedStaff.getId());
            staffMap.put("username", savedStaff.getUsername());
            staffMap.put("role", savedStaff.getRole());
            staffMap.put("email", savedStaff.getEmail() != null ? savedStaff.getEmail() : "");
            staffMap.put("active", savedStaff.getActive());

            return ResponseEntity.ok(staffMap);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to add staff: " + e.getMessage()));
        }
    }

    // スタッフ更新（管理者のみ）
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStaff(@RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody User staffData) {
        if (!authUtil.isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
        }

        try {
            Optional<User> existingStaff = userRepository.findById(id);
            if (existingStaff.isPresent()) {
                User staff = existingStaff.get();

                // 更新可能なフィールドのみ更新
                if (staffData.getUsername() != null) {
                    staff.setUsername(staffData.getUsername());
                }
                if (staffData.getPassword() != null && !staffData.getPassword().isEmpty()) {
                    staff.setPassword(staffData.getPassword());
                }
                if (staffData.getRole() != null) {
                    staff.setRole(staffData.getRole());
                }
                if (staffData.getEmail() != null) {
                    staff.setEmail(staffData.getEmail());
                }
                if (staffData.getActive() != null) {
                    staff.setActive(staffData.getActive());
                }

                User updatedStaff = userRepository.save(staff);

                // パスワードを除外してレスポンス
                Map<String, Object> staffMap = new HashMap<>();
                staffMap.put("id", updatedStaff.getId());
                staffMap.put("username", updatedStaff.getUsername());
                staffMap.put("role", updatedStaff.getRole());
                staffMap.put("email", updatedStaff.getEmail() != null ? updatedStaff.getEmail() : "");
                staffMap.put("active", updatedStaff.getActive());

                return ResponseEntity.ok(staffMap);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Staff not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to update staff: " + e.getMessage()));
        }
    }

    // スタッフ削除（管理者のみ）
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteStaff(@RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        if (!authUtil.isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
        }

        try {
            Optional<User> existingStaff = userRepository.findById(id);
            if (existingStaff.isPresent()) {
                User staff = existingStaff.get();

                // 現在のユーザー情報を取得
                Optional<User> currentUserOpt = authUtil.getUserFromToken(authHeader);
                if (currentUserOpt.isPresent()) {
                    User currentUser = currentUserOpt.get();
                    // 自分自身は削除できない
                    if (staff.getUsername().equals(currentUser.getUsername())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(Map.of("error", "Cannot delete your own account"));
                    }
                }

                userRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "Staff deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Staff not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to delete staff: " + e.getMessage()));
        }
    }

    // スタッフの有効/無効切り替え（管理者のみ）
    @PutMapping("/toggle-active/{id}")
    public ResponseEntity<?> toggleStaffActive(@RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        if (!authUtil.isAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
        }

        try {
            Optional<User> existingStaff = userRepository.findById(id);
            if (existingStaff.isPresent()) {
                User staff = existingStaff.get();

                // 現在のユーザー情報を取得
                Optional<User> currentUserOpt = authUtil.getUserFromToken(authHeader);
                if (currentUserOpt.isPresent()) {
                    User currentUser = currentUserOpt.get();
                    // 自分自身は無効化できない
                    if (staff.getUsername().equals(currentUser.getUsername())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(Map.of("error", "Cannot deactivate your own account"));
                    }
                }

                staff.setActive(!staff.getActive());
                User updatedStaff = userRepository.save(staff);

                return ResponseEntity.ok(Map.of(
                        "message", "Staff status updated successfully",
                        "active", updatedStaff.getActive()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Staff not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to update staff status: " + e.getMessage()));
        }
    }
}
