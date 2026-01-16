import React, { useState } from 'react';
import CrearProducto from './crearProducto';
import ListaProductos from './listaProductos';

function ModuloProductos({ usuario }) {
    const rol = usuario.nombre_rol;
    const [recargar, setRecargar] = useState(false);

    const refrescarLista = () => {
        setRecargar(!recargar);
    };

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                gap: '20px', 
                flexWrap: 'wrap', 
                alignItems: 'flex-start', 
                width: '100%' 
            }}>
            {/* Lado Izquierdo: Formulario */}
                {(rol === 'Administrador' || rol === 'Bodeguero') && (
                    <div style={{ flex: '0 0 350px' }}> {/* Ancho fijo para el form */}
                         <CrearProducto alGuardar={refrescarLista} usuario={usuario} />
                    </div>
                )}
                
                {/* Lado Derecho: Tabla */}
                <div style={{ flex: 1, minWidth: '400px' }}>
                    <ListaProductos key={recargar} usuario={usuario} />
                </div>
            </div>
        </div>
    );
}

export default ModuloProductos;