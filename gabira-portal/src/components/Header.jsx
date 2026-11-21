import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const dashboardPath = session?.role === "charity" ? "/charity-dashboard" : "/donor-dashboard";

  return (
    <header className="site-header">
      <div className="brand">
        <h1>
          Gabira Giving Portal
          <span className="tagline">Give together. Change lives.</span>
        </h1>
        <nav className="main-nav" aria-label="Main navigation">
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>

            {session ? (
              <>
                <li id="navGreeting">Hi, {session.name.split(" ")[0]}</li>
                <li><NavLink to={dashboardPath}>Dashboard</NavLink></li>
                <li><a href="#" onClick={handleLogout}>Logout</a></li>
              </>
            ) : (
              <>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register" className="nav-cta">Register</NavLink></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
