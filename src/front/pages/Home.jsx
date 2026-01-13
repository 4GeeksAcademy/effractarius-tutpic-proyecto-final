import React, { useEffect, useState } from "react";
import logoImageUrl from "../assets/img/11.png";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import CardReceta from "../components/CardReceta.jsx";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lista,setLista] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const loadMessage = async () => {
    try {
      
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

      const response = await fetch(`${backendUrl}/api/hello`);
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "set_hello", payload: data.message });
      } else {
        setError("Failed to load message from backend.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const getRecetas = async () => {
      try {
        var response = await fetch(`${backendUrl}recetas/lista`)
        if(!response.ok){
          throw new Error("error fetch lista recetas")
        }
        var data = await response.json()
        setLista(data.recetas)
      } catch (error) {
        console.error(error)
      }
    }
    getRecetas()
  },[])

  useEffect(() => {
    loadMessage();
  }, []);

  const token = localStorage.getItem("access_token");

  return (
    <div className="text-center mt-5 bg-warning-subtle">
      <h1 className="display-4">Bienvenido</h1>
      <p className="lead">
        <img src={logoImageUrl} className="w-25 square-img" alt="Effractarius Logo" />
      </p>
      <div className="d-flex flex-row justify-content-around flex-wrap bg-warning p-2">
        {lista.length > 0 && lista.map((ele)=>{
          return(
            <CardReceta key={ele.id} receta_id={ele.id} name={ele.name} desc={ele.descripcion} img={ele.foto_url}></CardReceta>
          )
        })}
      </div>
      <div className="d-flex justify-content-center gap-3 mt-3">
        <button className="btn btn-warning" onClick={() => navigate("/register")}>
          Ir a Registro
        </button>
        <button className="btn btn-warning" onClick={() => navigate("/login")}>
          Ir a Login
        </button>
        {token && (
          <button className="btn btn-warning" onClick={() => navigate("/dashboard")}>
            Ir a Dashboard
          </button>
        )}
      </div>
      {location.state?.message && (
        <div className="alert alert-success mt-3">
          {location.state.message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3">
          {error}
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