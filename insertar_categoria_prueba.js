const sqlite3 = require('sqlite3').verbose();

const dbPath = './netlify/functions/inventario.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Error al abrir la base de datos:', err.message);
    }
    console.log('Base de datos abierta correctamente.');
});

db.run('INSERT INTO categorias (id, nombre, descripcion) VALUES (?, ?, ?)', [5, 'General', 'Categoría de prueba'], function(err) {
    if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            console.log('La categoría con id 5 ya existe.');
        } else {
            console.error('Error insertando categoría:', err.message);
        }
    } else {
        console.log('Categoría de prueba insertada correctamente.');
    }
    db.close();
});
