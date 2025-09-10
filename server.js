const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

console.log('🚀 Iniciando servidor...');
console.log('📋 Variables de entorno:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGO_URI:', process.env.MONGO_URI ? 'Configurada' : 'No configurada');

const tasksRoutes = require('./routes/tasksRoutes');
const app = express();

// Configuración por defecto si no hay variable de entorno
const mongoLocal = 'mongodb://localhost:27017/todo-list';
const mongoUri = process.env.MONGO_URI || mongoLocal;
//Configuro puerto para que railway use su propio puerto y yo en local use el 3000
const PORT = process.env.PORT || 3000;

console.log('🔗 URI de MongoDB:', mongoUri);
console.log('🌐 Puerto:', PORT);

// Middleware
app.use(cors({
  origin: true, // Permite cualquier origen en Railway
  credentials: true
}));
app.use(bodyParser.json());
app.use('/api', tasksRoutes);

// Ruta de salud para Railway
app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'Servidor corriendo',
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
    });
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

// Configurar eventos de MongoDB
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB conectado exitosamente');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado');
});

// Iniciar servidor independientemente de MongoDB para Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🏥 Health check disponible en: http://0.0.0.0:${PORT}/health`);
  console.log(`📡 API disponible en: http://0.0.0.0:${PORT}/api`);
});

// Intentar conectar a MongoDB (no bloquear el servidor)
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
  socketTimeoutMS: 45000, // Cerrar sockets después de 45 segundos de inactividad
})
.catch(err => {
  console.error('⚠️ No se pudo conectar a MongoDB:', err.message);
  console.log('🔄 El servidor continuará funcionando sin base de datos');
});
