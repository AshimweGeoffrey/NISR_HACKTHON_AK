import "../styles/navigation.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";

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
        <li>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `nav-link${isActive ? " nav-link-active" : ""}`
            }
          >
            Analytics
          </NavLink>
        </li>
        <li>
          <button
            className="nav-link ml-prediction-btn"
            onClick={() => {
              // Dispatch the ML prediction URL in the event detail so the
              // ML redirect/wake component can target the correct API.
              const ev = new CustomEvent("open-ml-prediction-wait", {
                detail: {
                  url: "https://mal-nutrition-fastapi.onrender.com/",
                },
              });
              window.dispatchEvent(ev);
            }}
          >
            <svg
              className="ml-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M2 12l7-7 7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 12v7a1 1 0 001 1h1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>ML Prediction solution</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
