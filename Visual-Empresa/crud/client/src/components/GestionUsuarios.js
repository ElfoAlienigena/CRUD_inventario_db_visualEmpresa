import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './intranetStyles.css';

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    
    // Estados para el formulario de nuevo usuario
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("2"); // Por defecto seleccionamos 'Bodeguero' (ID 2)
    
    const [status, setStatus] = useState({ type: '', mensaje: '' });

    // 1. Cargar usuarios al iniciar
    const cargarUsuarios = () => {
        Axios.get('http://localhost:3001/api/usuarios/get')
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // 2. Crear un nuevo usuario
    const crearUsuario = (e) => {
        e.preventDefault();
        
        if(!nombre || !correo || !password) {
            setStatus({ type: 'error', mensaje: 'Todos los campos son obligatorios' });
            return;
        }

        Axios.post('http://localhost:3001/api/usuarios/create', {
            nombre: nombre,
            correo: correo,
            password: password,
            id_rol: rol
        }).then(() => {
            setStatus({ type: 'success', mensaje: 'Usuario creado exitosamente' });
            cargarUsuarios(); // Recargar la tabla
            // Limpiar formulario
            setNombre("");
            setCorreo("");
            setPassword("");
            setTimeout(() => setStatus({ type: '', mensaje: '' }), 3000);
        }).catch((err) => {
            setStatus({ type: 'error', mensaje: 'Error al crear usuario' });
        });
    };

    // 3. Eliminar usuario
    const eliminarUsuario = (id, nombreUsuario) => {
        if(window.confirm(`¿Estás seguro de eliminar el acceso a ${nombreUsuario}?`)) {
            Axios.delete(`http://localhost:3001/api/usuarios/delete/${id}`)
                .then(() => {
                    cargarUsuarios();
                })
                .catch(err => alert("No se pudo eliminar el usuario"));
        }
    };

    return (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* --- TARJETA 1: FORMULARIO DE CREACIÓN --- */}
            <div className="card-intranet" style={{ flex: 1, minWidth: '300px' }}>
                <div className="card-header">
                    <h3>👤 Registrar Nuevo Empleado</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={crearUsuario}>
                        <div className="form-group">
                            <label>Nombre Completo:</label>
                            <input 
                                type="text" className="form-control" 
                                value={nombre} onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo Corporativo:</label>
                            <input 
                                type="email" className="form-control" 
                                value={correo} onChange={(e) => setCorreo(e.target.value)}
                                placeholder="usuario@empresa.com"
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña:</label>
                            <input 
                                type="password" className="form-control" 
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Rol / Permisos:</label>
                            <select className="form-control" value={rol} onChange={(e) => setRol(e.target.value)}>
                                {/* Los valores (1, 2, 3) deben coincidir con tu DB */}
                                <option value="1">Administrador (Control Total)</option>
                                <option value="2">Bodeguero (Stock + Crear)</option>
                                <option value="3">Vendedor (Ventas + Editar)</option>
                            </select>
                        </div>

                        {status.mensaje && <div className={`alert ${status.type}`}>{status.mensaje}</div>}

                        <button type="submit" className="btn-primary-intranet">Crear Usuario</button>
                    </form>
                </div>
            </div>

            {/* --- TARJETA 2: LISTA DE USUARIOS --- */}
            <div className="card-intranet" style={{ flex: 2, minWidth: '400px' }}>
                <div className="card-header">
                    <h3>👥 Personal Activo</h3>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="table-intranet">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => (
                                <tr key={u.id_usuario}>
                                    <td style={{fontWeight: 'bold'}}>{u.nombre}</td>
                                    <td>{u.correo}</td>
                                    <td>
                                        {/* Badge de color según el rol */}
                                        <span className={`badge-rol ${u.nombre_rol.toLowerCase()}`}>
                                            {u.nombre_rol}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Evitar que el admin se borre a sí mismo (opcional visualmente) */}
                                        <button 
                                            className="btn-action" 
                                            style={{color: '#e74c3c'}}
                                            onClick={() => eliminarUsuario(u.id_usuario, u.nombre)}
                                            title="Revocar acceso"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GestionUsuarios;