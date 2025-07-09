-- ユーザーテーブルの初期データ作成
-- データベース: coresystem

-- userテーブルが存在しない場合は作成
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);

-- 初期ユーザーデータを挿入（既存データがない場合のみ）
INSERT IGNORE INTO user (username, password, role, email, active) VALUES
('admin', 'password123', 'admin', 'admin@example.com', TRUE),
('staff1', 'staff123', 'staff', 'staff1@example.com', TRUE),
('staff2', 'staff123', 'staff', 'staff2@example.com', TRUE);

-- 確認用クエリ
SELECT * FROM user;
