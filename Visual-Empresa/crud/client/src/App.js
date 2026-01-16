import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Sidebar from './components/sidebar';
import ModuloProductos from './components/moduloProductos';
import DashboardResumen from './components/dashboardResumen';
import GestionUsuarios from './components/GestionUsuarios'; // (Lo crearemos en paso 5)

function App() {
  // Estado Global del Usuario (null = no logueado)
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('resumen');

  // Si no hay usuario, retornamos SOLO la pantalla de Login
  if (!usuario) {
      return <Login setUsuarioGlobal={setUsuario} />;
  }

  // Si hay usuario, retornamos el Dashboard completo
  return (
    <div className="dashboard-container">
      
      {/* Pasamos el rol al Sidebar para ocultar botones */}
      <Sidebar 
          vistaActual={vista} 
          cambiarVista={setVista} 
          rol={usuario.nombre_rol} 
          cerrarSesion={() => setUsuario(null)}
      />

      <div className="content-area">
        {/* Header con nombre del usuario */}
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
             <span>Hola, <b>{usuario.nombre}</b> ({usuario.nombre_rol})</span>
        </div>

        {vista === 'resumen' && <DashboardResumen />}
        
        {/* Pasamos el ROL al módulo de productos para filtrar botones */}
        {vista === 'productos' && <ModuloProductos rol={usuario.nombre_rol} />}
        
        {/* Solo el Admin puede entrar aquí */}
        {vista === 'usuarios' && usuario.nombre_rol === 'Administrador' && <GestionUsuarios />}

      </div>
    </div>
  );
}

export default App;