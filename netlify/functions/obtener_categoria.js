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
        const sql = 'SELECT id, nombre, descripcion FROM categorias WHERE id = $1';
        const result = await pool.query(sql, [id]);
        if (result.rows.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Categoría no encontrada' }) };
        }
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result.rows[0])
        };
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al obtener la categoría: ' + error.message }) };
    }
};