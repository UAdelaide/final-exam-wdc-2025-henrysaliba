const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 8080;

// database configuation
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
};

async function insertTestData(connection) {
    await connection.execute(`DELETE FROM WalkRatings`);
    await connection.execute(`DELETE FROM WalkApplications`);
    await connection.execute(`DELETE FROM WalkRequests`);
    await connection.execute(`DELETE FROM Dogs`);
    await connection.execute(`DELETE FROM Users`);

    await connection.execute(`INSERT INTO Users (username, email, password_hash, role) VALUES
    ('alice123', 'alice@example.com', 'hashed123', 'owner'),
    ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
    ('carol123', 'carol@example.com', 'hashed789', 'owner')
    `);

    await connection.execute(`INSERT INTO Dogs (owner_id, name, size)
VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Charlie', 'large'),
((SELECT user_id FROM Users WHERE username = 'evaOwner'), 'Luna', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Daisy', 'small');
    `);
    await connection.execute(`




    `);
}