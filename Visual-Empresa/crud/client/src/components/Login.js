import React, { useState } from 'react';
import Axios from 'axios';
import './intranetStyles.css';

function Login({ setUsuarioGlobal }) {
    const [correo, setCorreo] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");

    const login = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/api/usuarios/login', {
            correo: correo,
            password: pass
        }).then((response) => {
            // ¡Éxito! Guardamos el usuario en el estado global de App.js
            setUsuarioGlobal(response.data);
        }).catch((err) => {
            setError("Correo o contraseña incorrectos");
        });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 style={{textAlign: 'center', color: '#2c3e50'}}>🔐 Acceso Intranet</h1>
                <form onSubmit={login}>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input type="email" className="form-control" onChange={(e) => setCorreo(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" className="form-control" onChange={(e) => setPass(e.target.value)} />
                    </div>
                    {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
                    <button type="submit" className="btn-primary-intranet">Ingresar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;