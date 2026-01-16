import React from 'react';
import './App.css';
import CrearCategoria from './components/crearCategoria';
import CrearProducto from './components/crearProducto';

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '20px' }}>
      
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>
        🏢 Intranet de Gestión
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        
        {/* Lado Izquierdo: Configuración */}
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
            <CrearCategoria />
        </div>

        {/* Lado Derecho: Operación Diaria */}
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
            <CrearProducto />
        </div>

      </div>

    </div>
  );
}

export default App;