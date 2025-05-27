const sqlite3 = require('sqlite3').verbose();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const productId = body.id;
    const { nombre, categoria_id, precio, stock, descripcion } = body;

    if (!productId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Se requiere el ID del producto para actualizar." }),
        };
    }

    if (!nombre || !categoria_id || typeof precio !== 'number' || typeof stock !== 'number') {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Se requieren todos los campos para actualizar el producto (nombre, categoria_id, precio, stock)." }),
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
        const query = `
            UPDATE productos
            SET nombre = ?,
                categoria_id = ?,
                precio = ?,
                stock = ?,
                descripcion = ?
            WHERE id = ?
        `;
        const params = [nombre, categoria_id, precio, stock, descripcion || '', productId];

        db.run(query, params, function (err) {
            if (err) {
                console.error(err.message);
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ message: "Error al actualizar el producto." }),
                });
            } else if (this.changes > 0) {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({
                        id: productId,
                        nombre: nombre,
                        categoria_id: categoria_id,
                        precio: precio,
                        stock: stock
                    }),
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