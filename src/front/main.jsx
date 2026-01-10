import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';

const Main = () => {
  // If backend URL is not set, show configuration screen
  if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "") {
    return (
      <React.StrictMode>
        <BackendURL />
      </React.StrictMode>
    );
  }

  // Otherwise, render the app with global state + router
  return (
    <React.StrictMode>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </React.StrictMode>
  );
};

// Mount the app
ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
