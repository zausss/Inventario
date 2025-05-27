const pool = require('./db_supabase');

exports.handler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { id } = event.queryStringParameters || {};
    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Falta el parámetro id' }) };
    }

    try {
        await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Producto eliminado con éxito.' }) };
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al eliminar el producto: ' + error.message }) };
    }
};
