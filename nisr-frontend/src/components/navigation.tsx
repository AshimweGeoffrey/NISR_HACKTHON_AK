import "../styles/navigation.css";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/hotspot" className={({ isActive }) => (isActive ? "active" : "")}>Hotspot Map</NavLink>
        </li>
        <li>Causes + Solution</li>
        <li>Policies</li>
      </ul>
    </nav>
  );
}

export default Navigation;
