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

    await connection.execute(`INSERT INTO Dogs (owner_id, name, size) VALUES
    ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
    ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
    `);

    await connection.execute(`INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
    ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
    ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted')
    `);
}

app.get('/api/dogs', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
            FROM Dogs
            JOIN Users ON Dogs.owner_id = Users.user_id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch dogs" });
    }
});

app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT
                WalkReuests.request_id,
                Dogs.name AS Dog_name,
                WalkRequests.requested_time,
                WalkRequests.duration_muntes,
                WalkRequests.location,
                Users.username AS owner_username
            FROM WalkRequests
            JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
            JOIN Users ON Dogs.owner_id = Users.user_id
            WHERE WalkRequests.status = 'open'
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch dogs" });
    }
});


app.get('/api/walkers/summary', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT
                u.username AS walker_username,
                COUNT(r.rating_id) AS total_ratings,
                ROUND(AVG(r.rating), 1) AS average_rating,
                (
                    SELECT COUNT(*) FROM WalkApplications a
                    JOIN WalkRequests
                )
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch dogs" });
    }
});