const sqlite3 = require('sqlite3').verbose();

const dbPath = './netlify/functions/inventario.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Error al abrir la base de datos:', err.message);
    }
    console.log('Base de datos abierta correctamente.');
});

db.all('SELECT * FROM productos', [], (err, rows) => {
    if (err) {
        console.error('Error leyendo productos:', err.message);
    } else {
        console.log('Productos:');
        rows.forEach(row => console.log(row));
    }
    db.close();
});
