import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";

const Signup = () => {
  useEffect(() => {
    document.title = "Signup | Let's Cook!";
  }, []);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignup = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://turbo-space-trout-5gpx5v4q5qqv2p4gv-3001.app.github.dev/api/signup",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // You might want to auto-login after signup
        localStorage.setItem("access_token", data.access_token);
        navigate("/dashboard", { state: { message: "Registro exitoso 🎉" } });
      } else {
        throw new Error(data.error || "Error al registrarse ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Página de Registro"
      subtitle="Crea tu cuenta para empezar a cocinar."
      submitLabel="Registrarse"
      onSubmit={handleSignup}
      loading={loading}
    />
  );
};

export default Signup;