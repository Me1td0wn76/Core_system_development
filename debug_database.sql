-- データベース: coresystem
-- 以下のSQLをphpMyAdminまたはMariaDBコマンドラインで実行してください

-- データベースを選択
USE coresystem;

-- 既存のテーブル構造を確認
SHOW TABLES;

-- userテーブルとusersテーブルの構造を確認
DESCRIBE user;
DESCRIBE users;

-- userテーブルが存在しない場合は作成
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);

-- 既存のユーザーを削除（念のため）
DELETE FROM user;

-- 初期ユーザーデータを挿入
INSERT INTO user (username, password, role, email, active) VALUES
('admin', 'password123', 'admin', 'admin@example.com', TRUE),
('staff1', 'staff123', 'staff', 'staff1@example.com', TRUE),
('staff2', 'staff123', 'staff', 'staff2@example.com', TRUE);

-- 追加後の確認
SELECT 'user table contents:' AS info;
SELECT * FROM user;

-- 特定のユーザーが存在するかテスト
SELECT 'Test query for admin user:' AS info;
SELECT * FROM user WHERE username = 'admin' AND active = TRUE;

-- usersテーブルの内容も確認
SELECT 'users table contents:' AS info;
SELECT * FROM users;
