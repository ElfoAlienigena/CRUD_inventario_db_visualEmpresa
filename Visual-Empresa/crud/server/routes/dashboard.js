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
            COUNT(*) as total_productos,
            SUM(stock_actual * precio_unitario) as valor_inventario,
            SUM(CASE WHEN stock_actual < 5 THEN 1 ELSE 0 END) as productos_bajo_stock
        FROM productos
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        
        // MySQL devuelve un array, tomamos el primer (y único) elemento
        res.send(result[0]);
    });
});

module.exports = router;