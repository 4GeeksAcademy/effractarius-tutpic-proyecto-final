import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlerRegistro = async () => {
    if (username.length < 2 || email.length < 7 || password.length < 8) {
      alert(
        "Por favor complete todos los campos correctamente. El nombre de usuario debe tener al menos 2 caracteres, el email al menos 7 caracteres y la contraseña al menos 8 caracteres."
      );
      return;
    }

    const payload = {
      username,
      email,
      password
    };

    const userData = { username, email, password };

    try {
      setLoading(true);
      const response = await fetch(
        "https://turbo-space-trout-5gpx5v4q5qqv2p4gv-3000.app.github.dev/api/create_user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Usuario creado exitosamente");
        setUsername("");
        setEmail("");
        setPassword("");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(`Error: ${data.message}`);
      }

      let Data = await response.json();
      if (Data) {
        alert("Usuario creado exitosamente");
        console.log(Data.nuevo_usuario);
      }

    } catch (error) {
      setMessage("Error de conexión con el servidor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Página de Registro</h1>

      <label htmlFor="username">Nombre de usuario:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Contraseña:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handlerRegistro} disabled={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Registro;