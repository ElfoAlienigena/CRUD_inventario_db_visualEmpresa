const express = require('express');
const app = express();
const cors = require('cors');

// Importar rutas
const productosRoutes = require('./routes/productos');
// const usuariosRoutes = require('./routes/usuarios'); // Para el futuro

app.use(cors());
app.use(express.json());

// Usar rutas
app.use('/api/productos', productosRoutes);

// ... otros imports
const categoriasRoutes = require('./routes/categorias');

// ... después de app.use(express.json())
app.use('/api/categorias', categoriasRoutes);

app.listen(3001, () => {
    console.log("Servidor Intranet corriendo en puerto 3001");
});