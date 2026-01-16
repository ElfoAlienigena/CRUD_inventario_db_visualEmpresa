const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. LOGIN (Verificar credenciales y devolver ROL)
router.post('/login', (req, res) => {
    const { correo, password } = req.body;

    // Hacemos JOIN para obtener el nombre del rol directamente
    const sql = `
        SELECT u.id_usuario, u.nombre, u.correo, r.nombre_rol 
        FROM usuarios u 
        JOIN roles r ON u.id_rol = r.id_rol 
        WHERE u.correo = ? AND u.password = ?
    `;

    db.query(sql, [correo, password], (err, result) => {
        if (err) return res.status(500).send(err);
        
        if (result.length > 0) {
            res.send(result[0]); // Devolvemos el usuario con su rol
        } else {
            res.status(401).send({ message: "Credenciales incorrectas" });
        }
    });
});

// 2. OBTENER TODOS LOS USUARIOS (Solo para Admin)
router.get('/get', (req, res) => {
    const sql = "SELECT u.id_usuario, u.nombre, u.correo, r.nombre_rol FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol";
    db.query(sql, (err, result) => res.send(result));
});

// 3. CREAR USUARIO (Solo Admin)
router.post('/create', (req, res) => {
    const { nombre, correo, password, id_rol } = req.body;
    const sql = "INSERT INTO usuarios (nombre, correo, password, id_rol) VALUES (?,?,?,?)";
    db.query(sql, [nombre, correo, password, id_rol], (err, result) => {
        if(err) return res.status(500).send(err);
        res.send(result);
    });
});

// 4. ELIMINAR USUARIO
router.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
    db.query(sql, [req.params.id], (err, result) => res.send(result));
});

module.exports = router;