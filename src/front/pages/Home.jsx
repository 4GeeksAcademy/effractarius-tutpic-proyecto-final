import React, { useEffect, useState } from "react";
import logoImageUrl from "../assets/img/11.png";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get state from navigation
  const [loading, setLoading] = useState(true);

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "set_hello", payload: data.message });
      }
    } catch (error) {
      console.error("Could not fetch the message from the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  const token = localStorage.getItem("access_token");

  return (
    <div className="text-center mt-5">
      <h1 className="display-4">Bienvenido</h1>
      <p className="lead">
        <img src={logoImageUrl} className="w-25 square-img" alt="Logo" />
      </p>

      <button className="btn btn-warning" onClick={() => navigate("/registro")}>
        Ir a Registro
      </button>
      <br /><br />
      <button className="btn btn-warning" onClick={() => navigate("/login")}>
        Ir a Login
      </button>
      <br /><br />
      {token && (
        <button className="btn btn-warning" onClick={() => navigate("/dashboard")}>
          Ir a Dashboard
        </button>
      )}

      {/* ✅ Show logout message if passed via state */}
      {location.state?.message && (
        <div className="alert alert-success mt-3">
          {location.state.message}
        </div>
      )}

      <div className="alert alert-info mt-3">
        {loading ? (
          <span className="text-danger">
            Loading message from the backend (make sure your Python 🐍 backend is running)...
          </span>
        ) : (
          <span>{store?.message}</span>
        )}
      </div>
    </div>
  );
};

export default Home;