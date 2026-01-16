import React, { useState } from 'react';
import CrearProducto from './crearProducto';
import ListaProductos from './listaProductos';

function ModuloProductos({ rol }) {
    const [recargar, setRecargar] = useState(false);

    const refrescarLista = () => {
        setRecargar(!recargar);
    };

    return (
        <div>
            {/* SOLO Admin y Bodeguero pueden ver el formulario de CREAR */}
            {(rol === 'Administrador' || rol === 'Bodeguero') && (
                <div style={{ flex: 1 }}>
                     <CrearProducto alGuardar={refrescarLista} />
                </div>
            )}
            
            <div style={{ flex: 2 }}>
                {/* Pasamos el rol a la tabla para filtrar botones internos */}
                <ListaProductos key={recargar} rolUsuario={rol} />
            </div>
        </div>
    );
}

export default ModuloProductos;