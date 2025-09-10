const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const tasksRoutes = require('./routes/tasksRoutes');
const app = express();

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


// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Iniciar servidor independientemente de MongoDB para Railway
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
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
