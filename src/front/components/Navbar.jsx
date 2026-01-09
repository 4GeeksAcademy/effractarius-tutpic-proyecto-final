import { Link } from "react-router-dom";
import logoTwoImageUrl from "../assets/img/022-17.jpg";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Ir a HOME</span>
				</Link>
				<p className="lead">
					<img
						src={logoTwoImageUrl}
						alt="Logo"
						style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
					/>
				</p>

				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-warning">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};