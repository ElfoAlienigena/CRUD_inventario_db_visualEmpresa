import React, { useState } from 'react';
import Axios from 'axios';
import './intranetStyles.css'; // Crearemos este archivo de estilos abajo

function CrearCategoria({ actualizarLista }) {
    // Estados para los campos
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    
    // Estado para feedback al usuario
    const [status, setStatus] = useState({ type: '', mensaje: '' });

    const guardarCategoria = (e) => {
        e.preventDefault(); // Evita que la página se recargue

        if(!nombre) {
            setStatus({ type: 'error', mensaje: 'El nombre es obligatorio' });
            return;
        }

        Axios.post('http://localhost:3001/api/categorias/create', {
            nombre_categoria: nombre,
            descripcion: descripcion
        }).then(() => {
            setStatus({ type: 'success', mensaje: 'Categoría guardada con éxito' });
            setNombre("");
            setDescripcion("");
            
            // Si pasamos una función para recargar la lista, la ejecutamos
            if(actualizarLista) actualizarLista();

            // Borrar el mensaje de éxito después de 3 segundos
            setTimeout(() => setStatus({ type: '', mensaje: '' }), 3000);
        }).catch((err) => {
            console.error(err);
            setStatus({ type: 'error', mensaje: 'Error al conectar con el servidor' });
        });
    };

    return (
        <div className="card-intranet">
            <div className="card-header">
                <h3>📂 Nueva Categoría</h3>
            </div>
            <div className="card-body">
                <form onSubmit={guardarCategoria}>
                    <div className="form-group">
                        <label>Nombre de la Categoría:</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Electrónica, Muebles..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción (Opcional):</label>
                        <textarea 
                            className="form-control"
                            rows="3"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Detalles sobre esta categoría..."
                        ></textarea>
                    </div>

                    {status.mensaje && (
                        <div className={`alert ${status.type}`}>
                            {status.mensaje}
                        </div>
                    )}

                    <button type="submit" className="btn-primary-intranet">
                        Guardar Categoría
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CrearCategoria;