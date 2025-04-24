const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('inventario_hilos'); // Asegúrate de que este sea el nombre correcto de tu base de datos en Atlas
    const categorias = await db.collection('categorias').find().toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(categorias),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al obtener las categorías desde la base de datos' }),
      headers: { 'Content-Type': 'application/json' },
    };
  } finally {
    if (client) await client.close();
  }
};