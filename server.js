const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const tasksRoutes = require('./routes/tasksRoutes');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(tasksRoutes);
app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));


// Configuración por defecto si no hay variable de entorno
const mongoLocal = 'mongodb://localhost:27017/todo-list'; // Cambiar a la base de datos que se desea usar de forma local
const mongoUri = process.env.MONGO_URI || mongoLocal;

mongoose.connect(mongoUri)
try {
    console.log('MongoDB conectado exitosamente')
} catch (error) {
    console.error('Error de conexión:', error);
}
