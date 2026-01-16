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
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', width: '100%' }}>
            {/* SOLO Admin y Bodeguero pueden ver el formulario de CREAR */}
            {(rol === 'Administrador' || rol === 'Bodeguero') && (
                <div style={{ flex: 1 }}>
                    <CrearProducto alGuardar={refrescarLista} usuario={usuario} />
                </div>
            )}
            
            <div style={{ flex: 2 }}>
                <ListaProductos key={recargar} usuario={usuario} />
            </div>
        </div>
    );
}

export default ModuloProductos;