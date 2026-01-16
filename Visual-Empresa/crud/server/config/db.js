const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Recuerda poner tu contraseña real
    database: 'intranet_inventario' 
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conectado a la base de datos Intranet Empresarial');
});

module.exports = db;