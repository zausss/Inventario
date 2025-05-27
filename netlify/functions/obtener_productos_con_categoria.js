const { conectarDB, cerrarDB, ejecutarConsulta } = require('./db');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const db = await conectarDB();
        const sql = `
            SELECT
                p.id,
                p.nombre,
                p.descripcion,
                p.precio,
                p.stock,
                c.nombre AS categoria_nombre
            FROM
                productos p
            LEFT JOIN
                categorias c ON p.categoria_id = c.id
        `;
        const productos = await ejecutarConsulta(db, sql);
        console.log('Productos obtenidos:', productos); // LOG DETALLADO
        await cerrarDB(db);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productos)
        };

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return { statusCode: 200, body: '[]' }; // Devuelve array vacío en caso de error para evitar romper el frontend
    }
};