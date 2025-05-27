const sqlite3 = require('sqlite3').verbose();

const dbPath = './netlify/functions/inventario.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Error al abrir la base de datos:', err.message);
    }
    console.log('Base de datos abierta correctamente.');
});

db.run('ALTER TABLE productos ADD COLUMN descripcion TEXT', (err) => {
    if (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('La columna descripcion ya existe.');
        } else {
            console.error('Error al agregar la columna descripcion:', err.message);
        }
    } else {
        console.log('Columna descripcion agregada correctamente.');
    }
    db.close();
});
