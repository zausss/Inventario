const pool = require('./db_supabase');

exports.handler = async (event) => {
    if (event.httpMethod !== 'PUT') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { id, nombre, descripcion } = JSON.parse(event.body);
    if (!id || !nombre) {
        return { statusCode: 400, body: JSON.stringify({ message: 'ID y nombre son obligatorios.' }) };
    }

    try {
        await pool.query('UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id = $3', [nombre, descripcion, id]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Categoría actualizada con éxito.' }) };
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al actualizar la categoría: ' + error.message }) };
    }
};