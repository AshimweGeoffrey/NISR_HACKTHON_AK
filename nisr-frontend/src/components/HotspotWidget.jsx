import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/dynamicHotspot.css";

export default function HotspotWidget({ topHotspots }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);

  const items = Array.isArray(topHotspots) ? topHotspots : [];

  return (
    <div className={`hotspot-widget ${open ? "open" : "closed"}`}>
      <button className="hw-toggle" onClick={toggle} aria-expanded={open}>
        <span className="hw-dot" /> Hotspots
        <span className="hw-count">{items.length}</span>
      </button>

      <div className="hw-panel" role="dialog" aria-hidden={!open}>
        <div className="hw-panel-header">
          <strong>Top Hotspots</strong>
          <button className="hw-close" onClick={toggle} aria-label="Close">
            ×
          </button>
        </div>
        <ul className="hw-list">
          {items.length === 0 && (
            <li className="hw-empty">No hotspots available</li>
          )}
          {items.map((h, i) => (
            <li key={i} className="hw-item">
              <div className="hw-item-title">
                {h.District || h.district || "Unknown"}
              </div>
              <div className="hw-item-meta">
                Risk: {h.RiskScore ?? h.risk ?? "—"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

HotspotWidget.propTypes = {
  topHotspots: PropTypes.array,
};
