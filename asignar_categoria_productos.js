const sqlite3 = require('sqlite3').verbose();

const dbPath = './netlify/functions/inventario.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Error al abrir la base de datos:', err.message);
    }
    console.log('Base de datos abierta correctamente.');
});

db.get('SELECT id FROM categorias LIMIT 1', (err, row) => {
    if (err) {
        console.error('Error obteniendo una categoría:', err.message);
        db.close();
        return;
    }
    if (!row) {
        console.error('No hay categorías en la base de datos. Agrega al menos una categoría primero.');
        db.close();
        return;
    }
    const categoriaId = row.id;
    db.run('UPDATE productos SET categoria_id = ? WHERE categoria_id IS NULL OR categoria_id = ""', [categoriaId], function(err) {
        if (err) {
            console.error('Error actualizando productos:', err.message);
        } else {
            console.log(`Productos actualizados: ${this.changes}`);
        }
        db.close();
    });
});
