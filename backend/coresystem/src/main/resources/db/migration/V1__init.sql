CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stock INT NOT NULL
);

INSERT INTO inventory (name, stock) VALUES
('りんご', 25),
('バナナ', 3),
('みかん', 0),
('ぶどう', 12);