-- 注文テーブル作成
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    order_date DATETIME NOT NULL
);

-- サンプルデータ
INSERT INTO orders (product, quantity, status, order_date) VALUES
('りんご', 2, '未発送', '2025-07-01 10:00:00'),
('バナナ', 1, '発送済み', '2025-07-02 11:00:00');
