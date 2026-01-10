import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "./AuthForm";

const Login = () => {
  useEffect(() => {
    document.title = "Login | Let's Cook!";
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/dashboard", { state: { message: "Login exitoso ✅" } });
      } else {
        throw new Error(data.error || "Error al iniciar sesión ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {location.state?.message && (
        <div className="alert alert-warning mt-3 text-center">
          {location.state.message}
        </div>
      )}
      <AuthForm
        title="Página de Login"
        subtitle="Aquí puedes loguearte."
        submitLabel="Iniciar Sesión"
        onSubmit={handleLogin}
        loading={loading}
      />
    </>
  );
};

export default Login;