create table subjects(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255)NOT NULL UNIQUE DEFAULT 'Demo_subject' ,    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    updated_at DATETIME NULL on UPDATE CURRENT_TIMESTAMP, 
    deleted_at DATETIME NULL,
    INDEX(name)
);

