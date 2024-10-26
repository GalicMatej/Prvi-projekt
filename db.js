require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.USER,         // Your PostgreSQL username
    host: process.env.HOST,             // Usually 'localhost' or the Render host URL
    database: process.env.DATABASE,     // The name of your database
    password: process.env.PASSWORD,     // Your PostgreSQL password
    port: process.env.DB_PORT,                    // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false,                // This option can be used in development but should be handled differently in production
    },
});

const query = async (text, params) => {
    const client = await pool.connect(); 
    try {
        const res = await client.query(text, params); 
        
        return res.rows; 
    } catch (err) {
        console.error('Query error', err.stack); 
    } finally {
        client.release();
    }
};

module.exports = {
    query,
};