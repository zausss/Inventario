const { conectarDB, cerrarDB, ejecutarConsulta } = require('./db');

exports.handler = async (event) => {
    try {
        const db = await conectarDB();
        const sql = 'SELECT id, nombre, categoria_id, stock FROM productos';
        const productos = await ejecutarConsulta(db, sql);
        await cerrarDB(db);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productos)
        };
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al obtener los productos.' }) };
    }
};
