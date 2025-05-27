const { conectarDB, cerrarDB } = require('./db');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { nombre, descripcion } = JSON.parse(event.body);

    if (!nombre) {
        return { statusCode: 400, body: JSON.stringify({ message: 'El nombre es obligatorio.' }) };
    }

    let db;
    try {
        db = await conectarDB();
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion], function(err) {
                if (err) {
                    console.error('Error al insertar la categoría:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        return { statusCode: 200, body: JSON.stringify({ message: 'Categoría creada con éxito.' }) };
    } catch (error) {
        console.error('Error al interactuar con la base de datos:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al crear la categoría: ' + error.message }) };
    } finally {
        await cerrarDB(db); // Asegúrate de cerrar la conexión
    }
};