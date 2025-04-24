// netlify/functions/crear_categoria.js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('inventario_hilos');
    const categoriasCollection = db.collection('categorias');
    const nuevaCategoria = JSON.parse(event.body);

    const result = await categoriasCollection.insertOne(nuevaCategoria);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Categoría creada con éxito', id: result.insertedId }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al crear la categoría en la base de datos' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
};