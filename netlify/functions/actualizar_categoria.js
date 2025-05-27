const { conectarDB, cerrarDB } = require('./db'); // Asegúrate de que la ruta a db.js sea correcta

exports.handler = async (event) => {
    if (event.httpMethod !== 'PUT') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const id = event.queryStringParameters.id;
    const { nombre, descripcion } = JSON.parse(event.body);

    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Se requiere el ID de la categoría.' }) };
    }

    if (!nombre) {
        return { statusCode: 400, body: JSON.stringify({ message: 'El nombre de la categoría es obligatorio.' }) };
    }

    let db;
    try {
        db = await conectarDB();
        const updateResult = await new Promise((resolve, reject) => {
            db.run('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id], function(err) {
                if (err) {
                    console.error('Error al actualizar la categoría:', err);
                    reject(err);
                } else if (this.changes > 0) {
                    resolve({ message: `Categoría con ID ${id} actualizada correctamente.` });
                } else {
                    resolve({ message: `No se encontró ninguna categoría con el ID ${id}.` });
                }
            });
        });

        return { statusCode: 200, body: JSON.stringify(updateResult) };

    } catch (error) {
        console.error('Error al interactuar con la base de datos:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al actualizar la categoría: ' + error.message }) };
    } finally {
        await cerrarDB(db);
    }
};