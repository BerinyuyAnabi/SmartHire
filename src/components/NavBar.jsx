import { NavLink } from "react-router-dom";
import image from "../assets/logo1.png";
import "../css/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">
          <img className="logo" src={image} alt="logo" />
        </NavLink>
      </div>

      <div className="navbar-links">
        <NavLink to="/apply" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
          Apply
        </NavLink>
        <NavLink to="/portal" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
          Portal
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
          Admin
        </NavLink>
      </div>

      <button className="logout-btn">Logout</button>
    </nav>
  );
}

export default NavBar;
