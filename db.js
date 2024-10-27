require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.USER,        
    host: process.env.HOST,            
    database: process.env.DATABASE,    
    password: process.env.PASSWORD,   
    port: process.env.DB_PORT,                  
    ssl: {
        rejectUnauthorized: false, 
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