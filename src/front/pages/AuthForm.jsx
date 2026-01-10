import React, { useState } from "react";

const AuthForm = ({ 
  title, 
  subtitle, 
  onSubmit, 
  submitLabel = "Enviar", 
  loading = false, 
  initialValues = { email: "", password: "" } 
}) => {
  const [email, setEmail] = useState(initialValues.email);
  const [password, setPassword] = useState(initialValues.password);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err.message || "Error inesperado ❌");
    }
  };

  return (
    <div className="text-center mt-5">
      <h1>{title}</h1>
      {subtitle && <p className="lead">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="form-group mb-3">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-warning" disabled={loading}>
          {loading ? "Procesando..." : submitLabel}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default AuthForm;