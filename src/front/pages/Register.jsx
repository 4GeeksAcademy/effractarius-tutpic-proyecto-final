import React, { useEffect, useState } from "react";

const Register = () => {
  useEffect(() => {
      document.title = "Register | Let's Cook!";
    }, []);
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlerRegister = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://turbo-space-trout-5gpx5v4q5qqv2p4gv-3001.app.github.dev/api/create_user", // adjust to your backend URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "username": username, "email": email, "password": password }), // ✅ aligned with backend
        }
      );

      const data = await response.json();
      console.log("Data", data);
      if (response.ok) {
        alert("Usuario creado exitosamente ✅");
        setUsername("");
        setEmail("");
        setPassword("");
        setError(null);
      } else {
        setError(data.error || "Error al crear usuario ❌");
      }
    } catch (err) {
      console.error("Error durante registro:", err);
      setError("Error de conexión con el servidor ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlerRegister();
      }}
      className="w-50 mx-auto"
    >
      <div className="form-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
};

export default Register;