const { conectarDB, cerrarDB, ejecutarConsulta } = require('./db');

exports.handler = async (event) => {
    try {
        const db = await conectarDB();
        const sql = 'SELECT COUNT(*) as total FROM productos';
        const result = await ejecutarConsulta(db, sql);
        await cerrarDB(db);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total: result[0].total })
        };
    } catch (error) {
        console.error('Error al obtener el total de productos:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al obtener el total de productos.' }) };
    }
};
