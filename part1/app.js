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

    await connection.execute(





    );
        await connection.execute(





    );
        await connection.execute(





    );
}