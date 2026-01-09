import React, { useEffect, useState } from "react";
import Logout from "../components/Logout.jsx";
import LogoutButton from "../components/LogoutButton.jsx";

const Dashboard = () => {
  const [user, setUser] = useState({}); // start with empty object

  useEffect(() => {
    const getRestricted = async () => {
      try {
        const response = await fetch(
          "https://turbo-space-trout-5gpx5v4q5qqv2p4gv-3001.app.github.dev/api/restringido",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener datos restringidos");
        }

        const data = await response.json();
        console.log("Datos restringidos obtenidos:", data.user);
        setUser(data.user);
      } catch (error) {
        console.error("Error al obtener datos restringidos:", error);
      }
    };

    getRestricted();
  }, []);

  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4">Dashboard</h1>
      <h2>{user?.username}</h2> {/* safe optional chaining */}
      <p className="lead">Bienvenido al área privada.</p>

      {/* You can choose one logout component */}
      <LogoutButton />
      {/* or */}
      {/* <Logout /> */}
    </div>
  );
};

export default Dashboard;