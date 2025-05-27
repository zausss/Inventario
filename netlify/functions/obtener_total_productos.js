const pool = require('./db_supabase');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const sql = 'SELECT COUNT(*) AS total FROM productos';
        const result = await pool.query(sql);
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ total: parseInt(result.rows[0].total, 10) })
        };
    } catch (error) {
        console.error('Error al obtener el total de productos:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al obtener el total de productos: ' + error.message }) };
    }
};
