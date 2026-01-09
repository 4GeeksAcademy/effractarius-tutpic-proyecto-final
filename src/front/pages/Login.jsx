import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handlerLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://turbo-space-trout-5gpx5v4q5qqv2p4gv-3001.app.github.dev/api/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/dashboard", { state: { message: "Login exitoso ✅" } });
      } else {
        setError(data.error || "Error al iniciar sesión ❌");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-5">
      {location.state?.message && (
        <div className="alert alert-warning mt-3">
          {location.state.message}
        </div>
      )}

      <h1>Página de Login</h1>
      <p className="lead">Aquí puedes loguearte.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlerLogin();
        }}
        className="w-50 mx-auto"
      >
        <div className="form-group mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />
        </div>

        <button type="submit" className="btn btn-warning" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default Login;