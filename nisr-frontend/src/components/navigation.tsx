import "../styles/navigation.css";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link${isActive ? " nav-link-active" : ""}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hotspot"
            className={({ isActive }) =>
              `nav-link${isActive ? " nav-link-active" : ""}`
            }
          >
            Hotspot Map
          </NavLink>
        </li>

        <li>Causes + Solution</li>
        <li>Policies</li>
      </ul>
    </nav>
  );
}

export default Navigation;
