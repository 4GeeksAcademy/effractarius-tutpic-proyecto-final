import React, { useState } from "react";

const Registro = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlerRegistro = async (e) => {
    e.preventDefault(); // prevent page reload

    if (name.length < 2 || email.length < 7 || password.length < 6) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    const payload = { name, email, password };

    try {
      const response = await fetch(
        "https://turbo-space-trout-5gpx5v4q5qqv2p4gv-3000.app.github.dev/api/create_user",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Usuario registrado exitosamente ✅");
        console.log("Usuario registrado:", data.nuevo_usuario);
      } else {
        alert("Error al registrar usuario ❌");
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="text-center mt-5">
      <h1 className="display-4">Página de Registro</h1>
      <p className="lead">Aquí puedes registrarte.</p>

      <form onSubmit={handlerRegistro} className="w-50 mx-auto">
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-warning">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Registro;