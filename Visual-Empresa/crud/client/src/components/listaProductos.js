import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './intranetStyles.css';

function ListaProductos() {
    const [productos, setProductos] = useState([]);

    // Función para cargar los datos
    const cargarProductos = () => {
        Axios.get('http://localhost:3001/api/productos/get')
            .then((response) => {
                setProductos(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar inventario:", error);
            });
    };

    // Cargar al iniciar el componente
    useEffect(() => {
        cargarProductos();
    }, []);

    return (
        <div className="card-intranet" style={{ maxWidth: '90%', marginTop: '30px' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>📋 Inventario Actual</h3>
                <button 
                    onClick={cargarProductos} 
                    className="btn-primary-intranet" 
                    style={{ width: 'auto', padding: '5px 15px', fontSize: '0.9rem' }}
                >
                    🔄 Actualizar
                </button>
            </div>
            
            <div className="card-body" style={{ padding: '0' }}>
                {productos.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                        No hay productos registrados aún.
                    </div>
                ) : (
                    <table className="table-intranet">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((prod) => (
                                <tr key={prod.id_producto}>
                                    <td style={{ fontWeight: 'bold', color: '#555' }}>{prod.codigo_sku}</td>
                                    <td>{prod.nombre_producto}</td>
                                    <td>
                                        <span className="badge-categoria">
                                            {prod.nombre_categoria || 'Sin Cat.'}
                                        </span>
                                    </td>
                                    <td>${prod.precio_unitario}</td>
                                    
                                    {/* Lógica Visual: Stock bajo en rojo y negrita */}
                                    <td style={{ 
                                        color: prod.stock_actual < 5 ? '#e74c3c' : '#27ae60', 
                                        fontWeight: 'bold' 
                                    }}>
                                        {prod.stock_actual} {prod.stock_actual < 5 && '⚠️'}
                                    </td>
                                    
                                    <td>
                                        <button className="btn-action">✏️</button>
                                        <button className="btn-action">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ListaProductos;