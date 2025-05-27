const sqlite3 = require('sqlite3').verbose();

exports.handler = async (event) => {
    const productId = event.queryStringParameters.id;

    if (!productId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Se requiere el ID del producto." }),
        };
    }

    const dbPath = './netlify/functions/inventario.db'; // Corrijo la ruta para que apunte a la base de datos correcta
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error("Error al abrir la base de datos:", err.message);
        } else {
            console.log("Base de datos abierta correctamente.");
        }
    });

    return new Promise((resolve, reject) => {
        const query = `SELECT id, nombre, categoria_id, precio, stock, descripcion FROM productos WHERE id = ?`;

        db.get(query, [productId], (err, row) => {
            if (err) {
                console.error(err.message);
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ message: "Error al obtener el producto." }),
                });
            } else if (row) {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify(row),
                });
            } else {
                resolve({
                    statusCode: 404,
                    body: JSON.stringify({ message: "Producto no encontrado." }),
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