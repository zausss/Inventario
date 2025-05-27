const pool = require('./db_supabase');

exports.handler = async (event) => {
    if (event.httpMethod !== 'PUT') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { id, nombre, categoria_id, precio, stock } = JSON.parse(event.body);
    if (!id || !nombre || !categoria_id || typeof precio !== 'number' || typeof stock !== 'number') {
        return { statusCode: 400, body: JSON.stringify({ message: 'Todos los campos son obligatorios.' }) };
    }

    try {
        await pool.query(
            'UPDATE productos SET nombre = $1, categoria_id = $2, precio = $3, stock = $4 WHERE id = $5',
            [nombre, categoria_id, precio, stock, id]
        );
        return { statusCode: 200, body: JSON.stringify({ message: 'Producto actualizado con éxito.' }) };
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al actualizar el producto: ' + error.message }) };
    }
};