import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handlerLogin = async () => {
    try {
      const response = await fetch(
        "https://turbo-space-trout-5gpx5v4q5qqv2p4gv-3000.app.github.dev/api/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login exitoso ✅");
        console.log("Usuario logueado:", data.access_token);
        localStorage.setItem("access_token", data.access_token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Error al iniciar sesión ❌");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="text-center mt-5">
      <h1>Página de Login</h1>
      <p className="lead">Aquí puedes loguearte.</p>

      <div className="form-group mb-3">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          className="form-control w-50 mx-auto"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          className="form-control w-50 mx-auto"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-warning" onClick={handlerLogin}>
        Iniciar Sesión
      </button>

      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}

      <p className="lead">Aquí puedes iniciar sesión.</p>
    </div>
  );
};

export default Login;