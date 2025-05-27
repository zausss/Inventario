const pool = require('./db_supabase');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const sql = 'SELECT id, nombre, categoria_id, precio, stock FROM productos';
        const result = await pool.query(sql);
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result.rows)
        };
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al obtener los productos: ' + error.message }) };
    }
};
