const pool = require('./db_supabase');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { nombre, descripcion, categoria_id, precio, stock } = JSON.parse(event.body);

    if (!nombre || !categoria_id || typeof precio !== 'number' || typeof stock !== 'number') {
        return { statusCode: 400, body: JSON.stringify({ message: 'Todos los campos son obligatorios.' }) };
    }

    try {
        await pool.query(
            'INSERT INTO productos (nombre, categoria_id, precio, stock) VALUES ($1, $2, $3, $4)',
            [nombre, categoria_id, precio, stock]
        );
        return { statusCode: 200, body: JSON.stringify({ message: 'Producto creado con éxito.' }) };
    } catch (error) {
        console.error('Error al crear el producto:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al crear el producto: ' + error.message }) };
    }
};