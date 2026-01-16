import React from 'react';
import './intranetStyles.css';

function Sidebar({ vistaActual, cambiarVista, rol, cerrarSesion }) {
    return (
        <div className="sidebar">
            <h2>INVENTARIO</h2>
            
            <button className={`menu-btn ${vistaActual === 'resumen' ? 'active' : ''}`} onClick={() => cambiarVista('resumen')}>
                📊 Resumen
            </button>

            {/* Todos pueden ver productos, pero tendrán acciones distintas dentro */}
            <button className={`menu-btn ${vistaActual === 'productos' ? 'active' : ''}`} onClick={() => cambiarVista('productos')}>
                📦 Inventario
            </button>

            {/* SOLO ADMINISTRADOR ve Usuarios */}
            {rol === 'Administrador' && (
                <button className={`menu-btn ${vistaActual === 'usuarios' ? 'active' : ''}`} onClick={() => cambiarVista('usuarios')}>
                    👥 Usuarios (Admin)
                </button>
            )}

            <button className="menu-btn" onClick={cerrarSesion} style={{marginTop: 'auto', color: '#e74c3c'}}>
                🚪 Cerrar Sesión
            </button>
        </div>
    );
}
export default Sidebar;