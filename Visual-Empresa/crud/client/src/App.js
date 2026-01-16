import React, { useState } from 'react'; // Importamos useState para manejar recargas
import './App.css';
import CrearCategoria from './components/crearCategoria';
import CrearProducto from './components/crearProducto';
import ListaProductos from './components/listaProductos';

function App() {
  // Truco Pro: Usamos una variable de estado para forzar la recarga de la lista
  // cuando creamos un producto nuevo.
  const [recargar, setRecargar] = useState(false);

  const refrescarLista = () => {
    setRecargar(!recargar); // Cambia el valor (true/false) para disparar el useEffect
  };

  return (
    <div className="App" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '20px' }}>
      
      <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px' }}>
        🏢 Intranet de Gestión
      </h1>

      {/* SECCIÓN DE CREACIÓN */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
        
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
            <CrearCategoria />
        </div>

        <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
            {/* Pasamos la función refrescarLista para que cuando guarde, avise a la tabla */}
            <CrearProducto alGuardar={refrescarLista} />
        </div>

      </div>

      {/* SECCIÓN DE VISUALIZACIÓN */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* La 'key' obliga a React a repintar el componente si cambia el valor de 'recargar' */}
          <ListaProductos key={recargar} />
      </div>

    </div>
  );
}

export default App;