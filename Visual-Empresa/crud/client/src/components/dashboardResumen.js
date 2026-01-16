import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './intranetStyles.css';

function DashboardResumen() {
    const [kpi, setKpi] = useState({
        total_productos: 0,
        valor_inventario: 0,
        productos_bajo_stock: 0
    });

    useEffect(() => {
        Axios.get('http://localhost:3001/api/dashboard/resumen')
            .then((response) => {
                setKpi(response.data);
            })
            .catch((error) => console.error("Error cargando dashboard:", error));
    }, []);

    // Función para formatear dinero (CLP, USD, etc.)
    const formatoMoneda = (valor) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor || 0);
    };

    return (
        <div className="resumen-container">
            {/* Cabecera con Título y Botón Imprimir */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#2c3e50', margin: 0 }}>📊 Resumen Ejecutivo</h2>

                <button 
                    onClick={() => window.print()} 
                    className="btn-print" // Estilo nuevo
                >
                    🖨️ Imprimir Reporte
                </button>
            </div>
            
            <div className="kpi-grid">
                
                {/* TARJETA 1: TOTAL PRODUCTOS (Azul) */}
                <div className="kpi-card blue">
                    <div className="icon">📦</div>
                    <div className="info">
                        <h3>Total Productos</h3>
                        <p>{kpi.total_productos}</p>
                    </div>
                </div>

                {/* TARJETA 2: VALOR INVENTARIO (Verde) */}
                <div className="kpi-card green">
                    <div className="icon">💰</div>
                    <div className="info">
                        <h3>Valor Inventario</h3>
                        <p>{formatoMoneda(kpi.valor_inventario)}</p>
                    </div>
                </div>

                {/* TARJETA 3: ALERTAS (Rojo) */}
                <div className="kpi-card red">
                    <div className="icon">⚠️</div>
                    <div className="info">
                        <h3>Stock Crítico</h3>
                        <p>{kpi.productos_bajo_stock} <span style={{fontSize: '0.8rem'}}>ítems</span></p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DashboardResumen;