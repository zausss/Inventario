const pool = require('./db_supabase');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { id } = event.queryStringParameters || {};
    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Falta el parámetro id' }) };
    }

    try {
        const sql = 'SELECT id, nombre, categoria_id, precio, stock FROM productos WHERE id = $1';
        const result = await pool.query(sql, [id]);
        if (result.rows.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Producto no encontrado' }) };
        }
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result.rows[0])
        };
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al obtener el producto: ' + error.message }) };
    }
};