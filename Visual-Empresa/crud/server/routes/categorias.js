const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. OBTENER TODAS LAS CATEGORÍAS (Para llenar el <select> en el Frontend)
router.get('/get', (req, res) => {
    const sqlSelect = "SELECT * FROM categorias";
    db.query(sqlSelect, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// 2. CREAR NUEVA CATEGORÍA
router.post('/create', (req, res) => {
    const { nombre_categoria, descripcion } = req.body;
    const sqlInsert = "INSERT INTO categorias (nombre_categoria, descripcion) VALUES (?, ?)";
    
    db.query(sqlInsert, [nombre_categoria, descripcion], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

module.exports = router;