package com.example.coresystem.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    // 仮の前回在庫数（本来はDBやキャッシュで管理）
    private static final Map<Integer, Integer> previousStock = new HashMap<>(Map.of(
            1, 5,
            2, 2,
            3, 10));

    // 今回の在庫数（本来はDBから取得）
    private static final Map<Integer, Integer> currentStock = new HashMap<>(Map.of(
            1, 8, // 補充された
            2, 2, // 変化なし
            3, 7 // 減った
    ));

    @GetMapping("/inventory")
    public List<Map<String, String>> getInventoryNotifications() {
        List<Map<String, String>> notifications = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : currentStock.entrySet()) {
            int id = entry.getKey();
            int now = entry.getValue();
            int before = previousStock.getOrDefault(id, now);
            if (now > before) {
                notifications.add(Map.of(
                        "type", "info",
                        "message", "商品ID " + id + " の在庫が補充されました（" + before + "→" + now + "）"));
            }
            // 必要なら減った場合や在庫切れ通知もここで追加
        }
        return notifications;
    }

    // 既存の全通知取得API
    @GetMapping
    public List<Map<String, String>> getAllNotifications() {
        List<Map<String, String>> notifications = new ArrayList<>();
        notifications.add(Map.of("type", "info", "message", "システムは正常に稼働中です"));
        notifications.add(Map.of("type", "warning", "message", "ディスク容量が少なくなっています"));
        // ...他の通知
        return notifications;
    }
}
