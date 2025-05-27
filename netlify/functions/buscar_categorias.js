const { conectarDB, cerrarDB, ejecutarConsulta } = require('./db');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const termino = event.queryStringParameters.termino;

    if (!termino) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([]) // Si no hay término, devolvemos un array vacío
        };
    }

    let db;
    try {
        db = await conectarDB();
        const sql = `
            SELECT id, nombre, descripcion
            FROM categorias
            WHERE nombre LIKE ?
        `;
        const categorias = await ejecutarConsulta(db, sql, [`%${termino}%`]);
        await cerrarDB(db);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categorias)
        };

    } catch (error) {
        console.error('Error al buscar categorías:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Error al buscar categorías: ' + error.message })
        };
    }
};