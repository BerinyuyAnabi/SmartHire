import { NavLink } from "react-router-dom";
import image from "../assets/logo1.png";
import "../css/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link">
          <p>Smart</p>
          <p className="nav_name">Hire</p>
        </NavLink>
      </div>

      <div className="navbar-links">
        <NavLink to="/apply" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
          Apply
        </NavLink>
        
        <button className="logout-btn">HR view</button>
      </div>
    </nav>
  );
}

export default NavBar;
