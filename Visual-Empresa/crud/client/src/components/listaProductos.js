import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import * as XLSX from 'xlsx';
import './intranetStyles.css';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

DataTable.use(DT);

function ListaProductos({ usuario }) {
    const rolUsuario = usuario.nombre_rol;
    const [productos, setProductos] = useState([]);
    
    // Estado para controlar la Modal de Edición
    const [productoEditando, setProductoEditando] = useState(null); // Si es null, modal cerrada
    const [formEdit, setFormEdit] = useState({ nombre: '', precio: 0, minimo: 0 });

    const cargarProductos = () => {
        Axios.get('http://localhost:3001/api/productos/get')
            .then((response) => setProductos(response.data))
            .catch((error) => console.error("Error:", error));
    };

    useEffect(() => { cargarProductos(); }, []);

    // --- FUNCIÓN 1: VENTA RÁPIDA (-1 Stock) ---
    const ventaRapida = (id_producto, stock_actual) => {
        if (stock_actual <= 0) return alert("¡No hay stock para vender!");

        Axios.post('http://localhost:3001/api/productos/movimiento', {
            id_producto: id_producto,
            id_usuario: usuario.id_usuario,
            tipo_movimiento: 'SALIDA',
            cantidad: 1,
            motivo: 'Venta Rápida (Botón)'
        }).then(() => {
            cargarProductos(); // Recargamos para ver el cambio inmediato
        }).catch(err => alert("Error al registrar venta"));
    };

    // Nueva función para Bodeguero
    const ingresoStock = (id_producto) => {

        // 1. Preguntar al usuario cuántas unidades llegaron
        const cantidadInput = window.prompt("🚛 LLEGADA DE MERCADERÍA\n\n¿Cuántas unidades llegaron?", "0");
        
        // 2. Convertir a número entero
        const cantidad = parseInt(cantidadInput);

        // 3. Validar que sea un número real y positivo
        if (!cantidad || cantidad <= 0) {
            return; // Si cancela o pone 0, no hacemos nada
        }
        // Lógica axios similar a ventaRapida pero tipo_movimiento: 'ENTRADA'
        Axios.post('http://localhost:3001/api/productos/movimiento', {
            id_producto: id_producto,
            id_usuario: usuario.id_usuario, // Usamos el ID del usuario logueado
            tipo_movimiento: 'ENTRADA',
            cantidad: cantidad,
            motivo: 'Ingreso de Stock'
        }).then(() => {
            alert(`✅ Se agregaron ${cantidad} unidades al inventario.`);
            cargarProductos(); // Recargamos para ver el cambio inmediato
        }).catch(err => alert("Error al registrar ingreso de stock"));
    };

    // --- FUNCIÓN 2: ELIMINAR ---
    const eliminarProducto = (id, nombre) => {
        if (window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
            Axios.delete(`http://localhost:3001/api/productos/delete/${id}`)
                .then(() => {
                    alert("Producto eliminado");
                    cargarProductos();
                })
                .catch((err) => {
                    alert("No se pudo eliminar. Probablemente tenga historial de movimientos.");
                });
        }
    };

    // --- FUNCIÓN 3: EDITAR (Abrir Modal) ---
    const abrirModalEdicion = (producto) => {
        setProductoEditando(producto);
        // Llenamos el formulario con los datos actuales
        setFormEdit({
            nombre: producto.nombre_producto,
            precio: producto.precio_unitario,
            minimo: 5 // Valor por defecto o el que venga de la BD
        });
    };

    const guardarEdicion = () => {
        Axios.put('http://localhost:3001/api/productos/update', {
            id_producto: productoEditando.id_producto,
            nombre: formEdit.nombre,
            precio_unitario: formEdit.precio,
            stock_minimo: formEdit.minimo
        }).then(() => {
            alert("Producto actualizado");
            setProductoEditando(null); // Cerrar modal
            cargarProductos();
        });
    };

    // --- EXPORTAR EXCEL (Tu código anterior) ---
    const descargarExcel = () => {
        const datosExcel = productos.map(prod => ({
            SKU: prod.codigo_sku,
            Producto: prod.nombre_producto,
            Stock: prod.stock_actual
        }));
        const hoja = XLSX.utils.json_to_sheet(datosExcel);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Inventario");
        XLSX.writeFile(libro, "Inventario.xlsx");
    };

    return (
        <div className="card-intranet" style={{ width: '100%' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>📋 Inventario Interactivo</h3>
                <div>
                    <button onClick={descargarExcel} className="btn-success-intranet" style={{ marginRight: '10px' }}>📊 Excel</button>
                    <button onClick={cargarProductos} className="btn-primary-intranet" style={{ width: 'auto' }}>🔄</button>
                </div>
            </div>
            
            <div className="card-body">
                {/* 3. VERIFICAMOS SI HAY DATOS ANTES DE RENDERIZAR DATATABLE */}
                {productos.length > 0 ? (
                    <DataTable 
                        className="display table-intranet" // Mantenemos tu clase y agregamos 'display' de DT
                        options={{
                            paging: true,
                            searching: true,
                            ordering: true,
                            responsive: true,
                            pageLength: 5,
                            lengthMenu: [5, 10, 20],
                            autoWidth: false,
                            language: {
                                search: "Buscar producto:",
                                lengthMenu: "Mostrar _MENU_ registros",
                                info: "_START_ - _END_ de _TOTAL_",
                                infoEmpty: "0 registros",
                                paginate: {
                                    first: "Primero",
                                    last: "Último",
                                    next: "Siguiente",
                                    previous: "Anterior"
                                }
                            }
                        }}
                    >
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones Rápidas</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((prod) => (
                                <tr key={prod.id_producto}>
                                    <td>
                                        <div style={{fontWeight: 'bold'}}>{prod.nombre_producto}</div>
                                        <small style={{color: '#888'}}>{prod.codigo_sku}</small>
                                    </td>
                                    {/* data-order ayuda a ordenar números con signos $ correctamente */}
                                    <td data-order={prod.precio_unitario}>
                                        ${prod.precio_unitario}
                                    </td>
                                    
                                    <td data-order={prod.stock_actual} style={{ color: prod.stock_actual < 5 ? 'red' : 'green', fontWeight: 'bold' }}>
                                        {prod.stock_actual}
                                    </td>
                                    
                                    <td>
                                        {(rolUsuario === 'Vendedor' || rolUsuario === 'Administrador') && (
                                            <button className="btn-quick-stock btn-minus" onClick={() => ventaRapida(prod.id_producto, prod.stock_actual)}>-1 Vender</button>
                                        )}
                                        {(rolUsuario === 'Bodeguero' || rolUsuario === 'Administrador') && (
                                            <button className="btn-quick-stock btn-plus" onClick={() => ingresoStock(prod.id_producto, prod.stock_actual)}>Reponer</button>
                                        )}
                                    </td>

                                    <td>
                                        {(rolUsuario === 'Vendedor' || rolUsuario === 'Administrador') && (
                                            <button className="btn-action" onClick={() => abrirModalEdicion(prod)}>✏️</button>
                                        )}
                                        {rolUsuario === 'Administrador' && (
                                            <button className="btn-action" onClick={() => eliminarProducto(prod.id_producto, prod.nombre_producto)}>🗑️</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </DataTable>
                ) : (
                    <p style={{textAlign: 'center', padding: '20px'}}>Cargando datos...</p>
                )}
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            {productoEditando && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Editar Producto</h3>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input 
                                className="form-control" 
                                value={formEdit.nombre} 
                                onChange={(e) => setFormEdit({...formEdit, nombre: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Precio:</label>
                            <input 
                                type="number"
                                className="form-control" 
                                value={formEdit.precio} 
                                onChange={(e) => setFormEdit({...formEdit, precio: e.target.value})}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-action" onClick={() => setProductoEditando(null)}>Cancelar</button>
                            <button className="btn-primary-intranet" style={{width: 'auto'}} onClick={guardarEdicion}>Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaProductos;