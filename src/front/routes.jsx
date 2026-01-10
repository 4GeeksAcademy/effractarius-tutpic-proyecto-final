// Import necessary components and functions from react-router-dom.

import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Single } from "./pages/Single.jsx";
import { Demo } from "./pages/Demo.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Signup from "./pages/Signup.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <h1>Not found!</h1>,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "signup", element: <Signup /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "single/:theId", element: <Single /> },
      { path: "demo", element: <Demo /> },
    ],
  },
]);