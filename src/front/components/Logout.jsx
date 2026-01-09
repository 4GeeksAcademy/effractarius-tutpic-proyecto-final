import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handlerLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/", { state: { message: "Sesión terminada correctamente ✅" } });
  };

  return (
    <div>
      <button className="btn btn-danger" onClick={handlerLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;