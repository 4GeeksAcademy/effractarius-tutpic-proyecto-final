import React from "react";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handlerLogin = async() => {
        try {
            const response = await fetch("https://turbo-space-trout-5gpx5v4q5qqv2p4gv-3000.app.github.dev/api/login", {
                method: "POST",
                body: JSON.stringify({ email:email, password:password }),
                headers: { "Content-Type": "application/json" },
            });
            let data = await response.json();
            if (data) {
                alert("Login exitoso");
                console.log("Usuario logueado:", data.access_token);
            } else {
                alert("Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div>
            <h1>Página de Login</h1>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br /><br />
            <label htmlFor="password" id="password">Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />
            <button className="btn btn-warning" onClick={handlerLogin}>Iniciar Sesión</button>
            <p className="lead">Aquí puedes iniciar sesión.</p>
        </div>
    );
};

export default Login;