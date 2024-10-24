const { Pool } = require('pg');

const pool = new Pool({
    user: "qr_code_database_rus3_user",         // Your PostgreSQL username
    host: "dpg-cs2mfol6l47c73blcr6g-a.frankfurt-postgres.render.com",             // Usually 'localhost' or the Render host URL
    database: "qr_code_database_rus3",     // The name of your database
    password: "IAJh45j5lXdgsFfao32ftPiZRNdu4aMV",     // Your PostgreSQL password
    port: 5432,                    // Default PostgreSQL port
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