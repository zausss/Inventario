const pool = require('./db_supabase');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { nombre, descripcion } = JSON.parse(event.body);

    if (!nombre) {
        return { statusCode: 400, body: JSON.stringify({ message: 'El nombre es obligatorio.' }) };
    }

    try {
        await pool.query('INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2)', [nombre, descripcion]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Categoría creada con éxito.' }) };
    } catch (error) {
        console.error('Error al interactuar con la base de datos:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al crear la categoría: ' + error.message }) };
    }
};