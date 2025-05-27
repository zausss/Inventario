const sqlite3 = require('sqlite3').verbose();

const dbPath = './netlify/functions/inventario.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Error al abrir la base de datos:', err.message);
    }
    console.log('Base de datos abierta correctamente.');
});

db.get("PRAGMA table_info(productos)", (err, row) => {
    if (err) {
        console.error('Error al obtener la información de la tabla:', err.message);
    } else {
        db.all("PRAGMA table_info(productos)", (err, rows) => {
            if (err) {
                console.error('Error al obtener la información de la tabla:', err.message);
            } else {
                console.log('Estructura de la tabla productos:');
                rows.forEach(col => console.log(col));
            }
            db.close();
        });
    }
});
