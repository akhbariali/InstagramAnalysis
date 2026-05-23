USE instagram_data;

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL UNIQUE,
    caption TEXT,
    tags JSON, 
    owner VARCHAR(100),
    likes INT,
    comments_count INT,
    top_comments JSON, 
    post_date DATETIME NOT NULL 
);