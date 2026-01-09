import React, { useEffect } from "react"
import logoImageUrl from "../assets/img/11.png";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4"></h1>
			<p className="lead">
				<img src={logoImageUrl} className="w-25 square-img" alt="Logo" />
			</p>

				<button className="btn btn-warning" onClick ={() => navigate("/registro")}>Ir a Registro</button>
				<br /><br />
				<button className="btn btn-warning" onClick ={() => navigate("/login")}>Ir a Login</button>
				<br /><br />
				<button className="btn btn-warning" onClick ={() => navigate("/dashboard")}>Ir a Dashboard</button>

			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
		</div>
	);
}; 

export default Home;