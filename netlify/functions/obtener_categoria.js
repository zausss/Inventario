const { conectarDB, cerrarDB, ejecutarConsulta } = require('./db');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const id = event.queryStringParameters.id;

    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Se requiere el ID de la categoría.' }) };
    }

    let db;
    try {
        db = await conectarDB();
        const sql = `
            SELECT id, nombre, descripcion
            FROM categorias
            WHERE id = ?
        `;
        const categoria = await ejecutarConsulta(db, sql, [id]);
        await cerrarDB(db);

        if (categoria && categoria.length > 0) {
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(categoria[0]) // Enviamos el primer (y único) resultado
            };
        } else {
            return { statusCode: 404, body: JSON.stringify({ message: 'Categoría no encontrada.' }) };
        }

    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al obtener la categoría: ' + error.message }) };
    }
};