import "../styles/dynamicHotspot.css";
import RwandaMap from "../components/RwandaMap"; // Ensure the RwandaMap component is imported
import HotspotWidget from "../components/HotspotWidget";
import { useEffect, useState } from "react";

export default function DynamicHotspot() {
  const [topHotspots, setTopHotspots] = useState<any | null>(null);
  const [districtAnalytics, setDistrictAnalytics] = useState<any[]>([]);

  useEffect(() => {
    fetch("/data/top_hotspots.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve(null)))
      .then((d) => setTopHotspots(d))
      .catch(() => setTopHotspots(null));

    fetch("/data/district_analytics.json")
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((d) => setDistrictAnalytics(d))
      .catch(() => setDistrictAnalytics([]));
  }, []);

  return (
    <div className="dynamic-hotspot-page">
      <main className="dh-main">
        <section className="dh-hero">
          <h1 className="dh-title">Dynamic Hotspot Map</h1>
          <p className="dh-lead">Map populated with live analytics.</p>

          <div className="dh-globe">
            {/* decorative area (kept for spacing) - make clickable to scroll to map */}
            <img
              src="/assets/Map.svg"
              alt="Map of Rwanda"
              role="button"
              tabIndex={0}
              aria-label="Map of Rwanda: click to jump to interactive map"
              title="Click to open interactive map"
              onClick={() => {
                const el = document.getElementById("dh-map-section");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const el = document.getElementById("dh-map-section");
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            />
            <div />
          </div>
        </section>

        <section id="dh-map-section" className="dh-map-section">
          <h2 className="dh-map-title">Interactive Data driven Map</h2>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <RwandaMap />
              {/* Floating hotspot widget */}
              <HotspotWidget topHotspots={topHotspots} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
