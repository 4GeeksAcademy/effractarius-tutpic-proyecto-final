import React from "react"
import { useState } from "react";

const Registro = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


const handlerRegistro = async () => {
    if (name.length < 2 || email.length < 7 || password.length < 6) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    const payload = { name, email, password }; 

    try {
        const response = await fetch("https://turbo-space-trout-5gpx5v4q5qqv2p4gv-3000.app.github.dev/api/create_user", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        })

        if (response.ok) {
            alert("Usuario registrado exitosamente");
        } else {
            alert("Error al registrar usuario");
        }
        let data = await response.json();
        if (data) {
            alert("Usuario registrado exitosamente");
            console.log("Usuario registrado:", data.nuevo_usuario);
        }
    } catch (error) {
        console.error("Error al registrar usuario:", error);
    }
};

return (
    <div className="text-center mt-5">
        <h1 className="display-4">Página de Registro</h1>
        <p className="lead">Aquí puedes registrarte.</p>
    </div>
);
};

export default Registro;