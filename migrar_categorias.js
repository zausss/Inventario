const sqlite3 = require('sqlite3').verbose();

const origen = './mi_inventario.db';
const destino = './netlify/functions/inventario.db';

const dbOrigen = new sqlite3.Database(origen, (err) => {
    if (err) return console.error('Error abriendo base de datos origen:', err.message);
    console.log('Base de datos origen abierta.');
});
const dbDestino = new sqlite3.Database(destino, (err) => {
    if (err) return console.error('Error abriendo base de datos destino:', err.message);
    console.log('Base de datos destino abierta.');
});

dbOrigen.all('SELECT * FROM categorias', [], (err, rows) => {
    if (err) {
        console.error('Error leyendo categorias:', err.message);
        dbOrigen.close();
        dbDestino.close();
        return;
    }
    if (rows.length === 0) {
        console.log('No hay categorias para migrar.');
        dbOrigen.close();
        dbDestino.close();
        return;
    }
    let migrados = 0;
    rows.forEach((row) => {
        dbDestino.run(
            'INSERT OR IGNORE INTO categorias (id, nombre, descripcion) VALUES (?, ?, ?)',
            [row.id, row.nombre, row.descripcion],
            function (err) {
                if (err) {
                    console.error('Error insertando categoria:', err.message);
                } else {
                    migrados++;
                }
                if (migrados === rows.length) {
                    console.log('Migración de categorías completada.');
                    dbOrigen.close();
                    dbDestino.close();
                }
            }
        );
    });
});
