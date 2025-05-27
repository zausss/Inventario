const { conectarDB, cerrarDB } = require('./db'); // Asegúrate de que la ruta a db.js sea correcta

exports.handler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const id = event.queryStringParameters.id;

    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Se requiere el ID de la categoría para eliminar.' }) };
    }

    let db;
    try {
        db = await conectarDB();
        const result = await new Promise((resolve, reject) => { // Asignamos el resultado a la variable 'result'
            db.run('DELETE FROM categorias WHERE id = ?', [id], function(err) {
                if (err) {
                    console.error('Error al eliminar la categoría:', err);
                    reject(err);
                } else if (this.changes > 0) {
                    resolve({ message: `Categoría con ID ${id} eliminada correctamente.` });
                } else {
                    resolve({ message: `No se encontró ninguna categoría con el ID ${id}.` });
                }
            });
        });

        return { statusCode: 200, body: JSON.stringify(result) }; // Ahora 'result' está definida

    } catch (error) {
        console.error('Error al interactuar con la base de datos:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error al eliminar la categoría: ' + error.message }) };
    } finally {
        await cerrarDB(db);
    }
};