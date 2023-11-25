#!/bin/bash

echo "|=============== CREATE-DB STARTED ===============|"
ROOT_PASSWD="pass"
DB="cashamole"

# Create database
mysql -u root -p$ROOT_PASSWD -e "CREATE DATABASE $DB;"


# Switch to the newly created database AND Create a table named 'users' with the specified columns
mysql -u root -p$ROOT_PASSWD -e "
    USE $DB; 
    CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(75) NOT NULL,
        password VARCHAR(200) NOT NULL,
        email VARCHAR(75) NOT NULL,
        join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(25) NOT NULL
    );"

# Switch to the newly created database AND Create test data for new users table
# mysql -u root -p$ROOT_PASSWD -e "
#     USE $DB; 
#     INSERT INTO users (username, password, email, join_date) VALUES
#         ('user1', 'password1', 'u1@thing.com', '2023-11-03'),
#         ('user2', 'password2', 'u2@thing.com', '2023-11-04'),
#         ('user3', 'password3', 'u3@thing.com', '2023-11-05'),
#         ('user4', 'password4', 'u4@thing.com', '2023-11-06'),
#         ('user5', 'password5', 'u5@thing.com', '2023-11-07');
#     "

echo "|=============== Database Created ===============|"
