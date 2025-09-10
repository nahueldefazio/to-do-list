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
app.use(cors({
  origin: true, // Permite cualquier origen en Railway
  credentials: true
}));
app.use(bodyParser.json());
app.use('/api', tasksRoutes);

// Ruta de salud para Railway
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  res.status(200).json(healthCheck);
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Lista de Tareas funcionando',
    endpoints: {
      health: '/health',
      tasks: '/api/allTasks',
      create: '/api/createTask',
      update: '/api/updateTask/:id',
      delete: '/api/deleteTask/:id'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Conexión a MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB conectado exitosamente');
    // Iniciar servidor solo después de conectar a MongoDB
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Health check disponible en: http://0.0.0.0:${PORT}/health`);
    });
  })
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err);
    process.exit(1);
  });
