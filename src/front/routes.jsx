// Import necessary components and functions from react-router-dom.

import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Single } from "./pages/Single.jsx";
import { Demo } from "./pages/Demo.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Receta from "./pages/Receta.jsx";
import CrearReceta from "./pages/CrearReceta.jsx";
import EditarReceta from "./pages/EditarReceta.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { BlogHome } from "./pages/BlogHome.jsx";
import { BlogArticulos } from "./pages/BlogArticulos.jsx";
import { BlogArticulo } from "./pages/BlogArticulo.jsx";
import { TiendaCarrito } from "./pages/TiendaCarrito.jsx";
import { TiendaCheckout } from "./pages/TiendaCheckout.jsx";
import { TiendaOrdenes } from "./pages/TiendaOrdenes.jsx";
import { TiendaProductos } from "./pages/TiendaProductos.jsx";


export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Index route: renders Home at "/" */}
      <Route index element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/single/:theId" element={<Single />} /> {/* Dynamic route */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/receta/crear" element={<CrearReceta />} />
      <Route path="/receta/:receta_id" element={<Receta />} />
      <Route path="/receta/editar/:receta_id" element={<EditarReceta />} />
      <Route path= "/reset-password" element= {<ResetPassword />} />
      <Route path= "/blog" element= {<BlogHome />} />
      <Route path= "/blog/articulos" element={ <BlogArticulos />}/>
      <Route path= "/blog/articulo/:id" element={ <BlogArticulo />} />
      <Route path= "/tienda" element={ <TiendaProductos /> }/>
      <Route path= "/tienda/carrito" element={ <TiendaCarrito /> }/>
      <Route path= "/tienda/checkout/:ordenId" element={ <TiendaCheckout /> }/>
      <Route path= "/tienda/ordenes" element={ <TiendaOrdenes /> }/>
    </Route>
  )
);