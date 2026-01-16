const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. OBTENER PRODUCTOS (Con nombre de categoría, no solo el ID)
router.get('/get', (req, res) => {
    const sqlSelect = `
        SELECT 
            p.id_producto, 
            p.codigo_sku, 
            p.nombre AS nombre_producto, 
            p.stock_actual, 
            p.precio_unitario, 
            c.nombre_categoria 
        FROM productos p
        LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    `;
    
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

// 2. AGREGAR PRODUCTO (Insertando con Foreign Key)
// AGREGAR PRODUCTO + REGISTRO EN HISTORIAL
router.post('/insert', (req, res) => {
    // Nota: El frontend debe enviarnos también el 'id_usuario' de quien está creando
    const { codigo_sku, nombre, stock_actual, precio_unitario, id_categoria, id_usuario } = req.body;

    const sqlInsertProducto = `
        INSERT INTO productos (codigo_sku, nombre, stock_actual, precio_unitario, id_categoria) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.beginTransaction((err) => {
        if (err) return res.status(500).send(err);

        // 1. Insertamos el Producto
        db.query(sqlInsertProducto, [codigo_sku, nombre, stock_actual, precio_unitario, id_categoria], (err, resultProducto) => {
            if (err) {
                return db.rollback(() => res.status(500).send("Error al crear producto"));
            }

            const idProductoNuevo = resultProducto.insertId; // Obtenemos el ID generado

            // 2. Insertamos Automáticamente en el Historial
            const sqlInsertHistorial = `
                INSERT INTO historial_movimientos (id_producto, id_usuario, tipo_movimiento, cantidad, motivo) 
                VALUES (?, ?, 'ENTRADA', ?, 'Inventario Inicial')
            `;

            db.query(sqlInsertHistorial, [idProductoNuevo, id_usuario, stock_actual], (err, resultHistorial) => {
                if (err) {
                    return db.rollback(() => res.status(500).send("Error al crear historial"));
                }

                db.commit((err) => {
                    if (err) return db.rollback(() => res.status(500).send("Error en commit"));
                    res.send("Producto creado y registrado en historial exitosamente");
                });
            });
        });
    });
});

// REGISTRAR MOVIMIENTO (Entrada o Salida de mercadería)
router.post('/movimiento', (req, res) => {
    const { id_producto, id_usuario, tipo_movimiento, cantidad, motivo } = req.body;
    
    // Validar tipo de movimiento
    if (!['ENTRADA', 'SALIDA', 'AJUSTE'].includes(tipo_movimiento)) {
        return res.status(400).send("Tipo de movimiento inválido");
    }

    // Definir si sumamos o restamos al stock actual
    let operador = '+';
    if (tipo_movimiento === 'SALIDA') operador = '-';
    // Si es AJUSTE, la lógica podría ser distinta, pero por ahora simplifiquemos entrada/salida

    db.beginTransaction((err) => {
        if (err) return res.status(500).send(err);

        // 1. Actualizar el Stock en la tabla Productos
        const sqlUpdateStock = `UPDATE productos SET stock_actual = stock_actual ${operador} ? WHERE id_producto = ?`;
        
        db.query(sqlUpdateStock, [cantidad, id_producto], (err, resultUpdate) => {
            if (err) return db.rollback(() => res.status(500).send("Error actualizando stock"));

            // 2. Registrar en el Historial
            const sqlInsertMov = `
                INSERT INTO historial_movimientos (id_producto, id_usuario, tipo_movimiento, cantidad, motivo) 
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(sqlInsertMov, [id_producto, id_usuario, tipo_movimiento, cantidad, motivo], (err, resultHist) => {
                if (err) return db.rollback(() => res.status(500).send("Error guardando historial"));

                db.commit((err) => {
                    if (err) return db.rollback(() => res.status(500).send("Error finalizando transacción"));
                    res.send("Movimiento registrado correctamente");
                });
            });
        });
    });
});

module.exports = router;