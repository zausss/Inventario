const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DATABASE_PATH = path.resolve(__dirname, './inventario.db');

const conectarDB = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DATABASE_PATH, (err) => {
            if (err) {
                console.error('Error al conectar a la base de datos:', err.message);
                reject(err);
            } else {
                console.log('Conexión a la base de datos exitosa.');
                resolve(db);
            }
        });
    });
};

const cerrarDB = (db) => {
    return new Promise((resolve, reject) => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('Error al cerrar la base de datos:', err.message);
                    reject(err);
                } else {
                    console.log('Base de datos cerrada.');
                    resolve();
                }
            });
        } else {
            resolve(); // Si db es undefined o null, resolvemos directamente
        }
    });
};

// Función para ejecutar una consulta SQL (SELECT)
const ejecutarConsulta = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Función para ejecutar una consulta SQL (INSERT, UPDATE, DELETE)
const ejecutarModificacion = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error al ejecutar la modificación:', err.message);
                reject(err);
            } else {
                resolve(this.lastID || this.changes); // Devuelve el ID insertado o el número de filas afectadas
            }
        });
    });
};

module.exports = { conectarDB, cerrarDB, ejecutarConsulta, ejecutarModificacion };