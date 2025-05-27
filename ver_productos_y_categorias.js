const sqlite3 = require('sqlite3').verbose();

const dbPath = './netlify/functions/inventario.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Error al abrir la base de datos:', err.message);
    }
    console.log('Base de datos abierta correctamente.');
});

db.all('SELECT *, typeof(id) as tipo_id, typeof(nombre) as tipo_nombre, typeof(descripcion) as tipo_descripcion, typeof(categoria_id) as tipo_categoria_id, typeof(precio) as tipo_precio, typeof(stock) as tipo_stock FROM productos', [], (err, rows) => {
    if (err) {
        console.error('Error leyendo productos:', err.message);
    } else {
        console.log('Productos:');
        rows.forEach(row => console.log(row));
    }
    db.all('SELECT *, typeof(id) as tipo_id, typeof(nombre) as tipo_nombre, typeof(descripcion) as tipo_descripcion FROM categorias', [], (err, rows) => {
        if (err) {
            console.error('Error leyendo categorias:', err.message);
        } else {
            console.log('Categorias:');
            rows.forEach(row => console.log(row));
        }
        db.close();
    });
});
