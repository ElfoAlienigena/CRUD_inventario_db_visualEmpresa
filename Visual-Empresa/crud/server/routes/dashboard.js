const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/resumen', (req, res) => {
    // Esta consulta es "Business Intelligence" pura:
    // 1. Cuenta productos
    // 2. Suma el valor monetario (Precio * Stock)
    // 3. Cuenta cuántos tienen menos de 5 unidades (Alertas)
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM productos) as total_productos,
            
            (SELECT SUM(stock_actual * precio_unitario) FROM productos) as valor_inventario,
            
            (SELECT COUNT(*) FROM productos WHERE stock_actual < 5) as productos_bajo_stock,
            
            (SELECT COALESCE(SUM(h.cantidad * p.precio_unitario), 0) 
             FROM historial_movimientos h 
             JOIN productos p ON h.id_producto = p.id_producto 
             WHERE h.tipo_movimiento = 'SALIDA') as total_ventas
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        
        // MySQL devuelve un array, tomamos el primer (y único) elemento
        res.send(result[0]);
    });
});

module.exports = router;