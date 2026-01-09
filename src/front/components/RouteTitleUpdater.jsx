import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Home | Let's Cook";
        break;
      case "/login":
        document.title = "Login | Let's Cook";
        break;
      case "/registro":
        document.title = "Registro | Let's Cook";
        break;
      default:
        document.title = "Let's Cook";
    }
  }, [location]);

  return null; // This component doesn’t render anything
};

export default RouteTitleUpdater;