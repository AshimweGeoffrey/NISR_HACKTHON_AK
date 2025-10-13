import "../styles/dynamicHotspot.css";
import RwandaMap from "../components/RwandaMap"; // Ensure the RwandaMap component is imported
export default function DynamicHotspot() {
  return (
    <div className="dynamic-hotspot-page">
      <main className="dh-main">
        <section className="dh-hero">
          <h1 className="dh-title">Dynamic Hotspot Map</h1>
          <p className="dh-lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna.
          </p>

          <div className="dh-globe">
            {/* decorative area (kept for spacing) */}
            <img src="/assets/Map.svg" alt="Interactive map" aria-hidden />
            <div />
          </div>
        </section>

        <section className="dh-map-section">
          <h2 className="dh-map-title">Interactive Data driven Map</h2>
          <div>
            <RwandaMap />
          </div>
        </section>
      </main>
    </div>
  );
}
