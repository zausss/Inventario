const { conectarDB, cerrarDB, ejecutarConsulta } = require('./db');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let db;
    try {
        db = await conectarDB();
        const sql = `
            SELECT id, nombre, descripcion
            FROM categorias
        `;
        const categorias = await ejecutarConsulta(db, sql);
        await cerrarDB(db);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categorias)
        };

    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al obtener las categorías: ' + error.message }) };
    }
};