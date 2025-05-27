const sqlite3 = require('sqlite3').verbose();

exports.handler = async (event) => {
    const productId = event.queryStringParameters.id;

    if (!productId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Se requiere el ID del producto para eliminar." }),
        };
    }

    const dbPath = './netlify/functions/inventario.db';
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("Error al abrir la base de datos:", err.message);
        } else {
            console.log("Base de datos abierta correctamente.");
        }
    });

    return new Promise((resolve, reject) => {
        const query = `DELETE FROM productos WHERE id = ?`;
        db.run(query, [productId], function (err) {
            if (err) {
                console.error(err.message);
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ message: "Error al eliminar el producto." }),
                });
            } else if (this.changes > 0) {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: "Producto eliminado correctamente." }),
                });
            } else {
                resolve({
                    statusCode: 404,
                    body: JSON.stringify({ message: "No se encontró el producto con el ID proporcionado." }),
                });
            }
            db.close((err) => {
                if (err) {
                    console.error("Error al cerrar la base de datos:", err.message);
                } else {
                    console.log("Base de datos cerrada correctamente.");
                }
            });
        });
    });
};
