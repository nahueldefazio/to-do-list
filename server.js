const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const tasksRoutes = require('./routes/tasksRoutes');
const app = express();

// Configuración por defecto si no hay variable de entorno
const mongoLocal = 'mongodb://localhost:27017/todo-list';
const mongoUri = process.env.MONGO_URI || mongoLocal;
//Configuro puerto para que railway use su propio puerto y yo en local use el 3000
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', tasksRoutes);

// Conexión a MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB conectado exitosamente');
    // Iniciar servidor solo después de conectar a MongoDB
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error de conexión:', err);
    process.exit(1);
  });
