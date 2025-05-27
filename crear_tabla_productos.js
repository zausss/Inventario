const sqlite3 = require('sqlite3').verbose();

const dbPath = './netlify/functions/inventario.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Error al abrir la base de datos:', err.message);
    }
    console.log('Base de datos abierta correctamente.');
});

db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL
);`, (err) => {
    if (err) {
        console.error('Error creando la tabla productos:', err.message);
    } else {
        console.log('Tabla productos creada o ya existente.');
    }
    db.close();
});
