const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // Use environment variables for sensitive data
    user: process.env.DB_USER || 'root',      // Default to 'root' if not set
    password: process.env.DB_PASSWORD || '',    // Default to empty password if not set
    database: process.env.DB_NAME || 'star_vision_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection (optional, but good for immediate feedback)
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        // Exit process if critical connection fails on startup in a real app
        // process.exit(1); 
    }
}

testConnection(); // Call the test function

module.exports = pool;
