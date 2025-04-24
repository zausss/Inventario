const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // Puedes elegir otro puerto

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Para analizar los cuerpos de las peticiones en formato JSON

// Reemplaza con tu URI de conexión a MongoDB
const uri = "mongodb://localhost:27017/inventario_hilos";
const client = new MongoClient(uri);
let db; // Variable para almacenar la instancia de la base de datos

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Conectado a la base de datos MongoDB");
        db = client.db();
    } catch (e) {
        console.error("Error al conectar a la base de datos:", e);
    }
}

connectToDatabase();

app.get('/', (req, res) => {
    res.send('¡El backend del inventario está funcionando!');
});

// --- Rutas para Categorías ---

// Obtener todas las categorías
app.get('/api/categorias', async (req, res) => {
    try {
        const categorias = await db.collection('categorias').find().toArray();
        res.json(categorias);
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).json({ message: "Error al obtener las categorías" });
    }
});

// Crear una nueva categoría
app.post('/api/categorias', async (req, res) => {
    try {
        const nuevaCategoria = req.body;
        const result = await db.collection('categorias').insertOne(nuevaCategoria);
        res.status(201).json({ message: "Categoría creada con éxito", id: result.insertedId });
    } catch (error) {
        console.error("Error al crear la categoría:", error);
        res.status(500).json({ message: "Error al crear la categoría" });
    }
});

// Obtener una categoría por ID (para la edición)
app.get('/api/categorias/:id', async (req, res) => {
    try {
        const categoriaId = req.params.id;
        const categoria = await db.collection('categorias').findOne({ _id: new ObjectId(categoriaId) });
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(categoria);
    } catch (error) {
        console.error("Error al obtener la categoría:", error);
        res.status(500).json({ message: "Error al obtener la categoría" });
    }
});

// Editar una categoría por ID
app.put('/api/categorias/:id', async (req, res) => {
    try {
        const categoriaId = req.params.id;
        const nuevosDatos = req.body;
        const result = await db.collection('categorias').updateOne(
            { _id: new ObjectId(categoriaId) },
            { $set: { nombre: nuevosDatos.nombre, descripcion: nuevosDatos.descripcion } } // Ajusta los campos a actualizar
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría actualizada con éxito' });
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        res.status(500).json({ message: "Error al actualizar la categoría" });
    }
});

// Eliminar una categoría por ID
app.delete('/api/categorias/:id', async (req, res) => {
    try {
        const categoriaId = req.params.id;
        const result = await db.collection('categorias').deleteOne({ _id: new ObjectId(categoriaId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada con éxito' });
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        res.status(500).json({ message: "Error al eliminar la categoría" });
    }
});

// --- Rutas para Productos ---

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await db.collection('productos').find().toArray();
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
});

// Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
    try {
        const nuevoProducto = req.body;
        const result = await db.collection('productos').insertOne(nuevoProducto);
        res.status(201).json({ message: "Producto creado con éxito", id: result.insertedId });
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ message: "Error al crear el producto" });
    }
});

app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
});

// --- Rutas para el Dashboard ---

// Obtener el total de productos registrados
app.get('/api/productos/count', async (req, res) => {
    try {
        const totalProductos = await db.collection('productos').countDocuments();
        res.json({ total: totalProductos });
    } catch (error) {
        console.error("Error al obtener el total de productos:", error);
        res.status(500).json({ message: "Error al obtener el total de productos" });
    }
});

// Obtener el total de existencias (sumando el stock de todos los productos)
app.get('/api/existencias/total', async (req, res) => {
    try {
        const productos = await db.collection('productos').find({}, { projection: { stock: 1, _id: 0 } }).toArray();
        let totalExistencias = 0;
        productos.forEach(producto => {
            totalExistencias += producto.stock || 0;
        });
        res.json({ total: totalExistencias });
    } catch (error) {
        console.error("Error al obtener el total de existencias:", error);
        res.status(500).json({ message: "Error al obtener el total de existencias" });
    }
});



// --- Rutas para Productos (Añadir estas secciones) ---

// Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const productoId = req.params.id;
        const producto = await db.collection('productos').findOne({ _id: new ObjectId(productoId) });
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ message: "Error al obtener el producto" });
    }
});

// Editar un producto por ID
app.put('/api/productos/:id', async (req, res) => {
    try {
        const productoId = req.params.id;
        const nuevosDatos = req.body;
        const result = await db.collection('productos').updateOne(
            { _id: new ObjectId(productoId) },
            { $set: nuevosDatos } // Suponiendo que req.body contiene todos los campos a actualizar
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
});

// Eliminar un producto por ID
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const productoId = req.params.id;
        const result = await db.collection('productos').deleteOne({ _id: new ObjectId(productoId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
});

