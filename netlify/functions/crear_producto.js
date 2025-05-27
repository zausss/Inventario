const { conectarDB, cerrarDB, ejecutarModificacion } = require('./db');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { nombre, descripcion, categoria_id, precio, stock } = JSON.parse(event.body);

        if (!nombre || !categoria_id || isNaN(precio) || isNaN(stock)) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Todos los campos requeridos deben ser proporcionados.' }) };
        }

        const db = await conectarDB();
        const sql = `
            INSERT INTO productos (nombre, descripcion, categoria_id, precio, stock)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [nombre, descripcion, categoria_id, precio, stock];
        await ejecutarModificacion(db, sql, params);
        await cerrarDB(db);

        return { statusCode: 200, body: JSON.stringify({ message: 'Producto creado con éxito.' }) };

    } catch (error) {
        console.error('Error al crear el producto:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al crear el producto: ' + error.message }) };
    }
};