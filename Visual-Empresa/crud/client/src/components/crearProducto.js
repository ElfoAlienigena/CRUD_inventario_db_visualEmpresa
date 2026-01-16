import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './intranetStyles.css'; // Reusamos los mismos estilos elegantes

function CrearProducto({ alGuardar }) {
    // 1. Estados para los datos del formulario
    const [sku, setSku] = useState("");
    const [nombre, setNombre] = useState("");
    const [stock, setStock] = useState(0);
    const [precio, setPrecio] = useState(0);
    const [categoriaId, setCategoriaId] = useState("");

    // 2. Estado para almacenar la lista de categorías que vienen de la DB
    const [listaCategorias, setListaCategorias] = useState([]);

    // 3. Estado para mensajes de feedback
    const [status, setStatus] = useState({ type: '', mensaje: '' });

    // 4. USE EFFECT: Se ejecuta automáticamente al cargar el componente
    useEffect(() => {
        Axios.get('http://localhost:3001/api/categorias/get')
            .then((response) => {
                setListaCategorias(response.data);
            })
            .catch((error) => {
                console.error("Error cargando categorías:", error);
            });
    }, []);

    const guardarProducto = (e) => {
        e.preventDefault();

        // Validación básica
        if (!nombre || !sku || !categoriaId) {
            setStatus({ type: 'error', mensaje: 'Por favor complete los campos obligatorios (*)' });
            return;
        }

        Axios.post('http://localhost:3001/api/productos/insert', {
            codigo_sku: sku,
            nombre: nombre,
            stock_actual: stock,
            precio_unitario: precio,
            id_categoria: categoriaId,
            id_usuario: 1 // IMPORTANTE: Por ahora hardcodeamos "1" (Admin). Luego vendrá del Login.
        }).then(() => {
            setStatus({ type: 'success', mensaje: 'Producto registrado e inventariado correctamente' });
            if(alGuardar) alGuardar();
            // Limpiar formulario
            setSku("");
            setNombre("");
            setStock(0);
            setPrecio(0);
            setCategoriaId("");
            
            setTimeout(() => setStatus({ type: '', mensaje: '' }), 3000);
        }).catch((err) => {
            console.error(err);
            setStatus({ type: 'error', mensaje: 'Error al guardar el producto' });
        });
    };

    return (
        <div className="card-intranet">
            <div className="card-header">
                <h3>📦 Nuevo Producto</h3>
            </div>
            <div className="card-body">
                <form onSubmit={guardarProducto}>
                    
                    {/* Fila 1: SKU y Nombre */}
                    <div className="form-group">
                        <label>Código SKU / Barras *</label>
                        <input type="text" className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Ej: PROD-001" />
                    </div>
                    
                    <div className="form-group">
                        <label>Nombre del Producto *</label>
                        <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Monitor 24 pulgadas" />
                    </div>

                    {/* Fila 2: Precios y Stock */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Stock Inicial</label>
                            <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Precio ($)</label>
                            <input type="number" step="0.01" className="form-control" value={precio} onChange={(e) => setPrecio(e.target.value)} />
                        </div>
                    </div>

                    {/* Fila 3: SELECTOR DINÁMICO DE CATEGORÍAS */}
                    <div className="form-group">
                        <label>Categoría *</label>
                        <select 
                            className="form-control" 
                            value={categoriaId} 
                            onChange={(e) => setCategoriaId(e.target.value)}
                        >
                            <option value="">-- Seleccione una categoría --</option>
                            {/* Aquí "mapeamos" el array para crear las opciones */}
                            {listaCategorias.map((cat) => (
                                <option key={cat.id_categoria} value={cat.id_categoria}>
                                    {cat.nombre_categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    {status.mensaje && <div className={`alert ${status.type}`}>{status.mensaje}</div>}

                    <button type="submit" className="btn-primary-intranet">Registrar Producto</button>
                </form>
            </div>
        </div>
    );
}

export default CrearProducto;