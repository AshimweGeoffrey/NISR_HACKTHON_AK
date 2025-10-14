// RwandaMap.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, GeoJSON, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/RwandaMap.css";

const provinceColors = {
  Kigali: "#e41a1c",
  Northern: "#377eb8",
  Southern: "#4daf4a",
  Eastern: "#ff7f00",
  Western: "#984ea3",
};

const provinceNameMap = {
  Amajyaruguru: "Northern",
  Amajyepfo: "Southern",
  Iburasirazuba: "Eastern",
  Iburengerazuba: "Western",
  "Umujyi wa Kigali": "Kigali",
};

const InfoControl = ({ district }) => {
  const map = useMap();

  // Create the control once when the map becomes available.
  useEffect(() => {
    const info = L.control();

    info.onAdd = () => {
      const div = L.DomUtil.create("div", "info-panel");
      div.innerHTML = ""; // initial empty content
      return div;
    };

    info.addTo(map);

    return () => {
      info.remove();
    };
    // only run on map change (mount/unmount)
  }, [map]);

  // Update the content of the control whenever `district` changes.
  useEffect(() => {
    const container = document.querySelector(".info-panel");
    if (!container) return;

    if (district) {
      const provinceName = provinceNameMap[district.NAME_1] || district.NAME_1;
      // Show a compact analytics preview on hover when available
      const risk =
        district.RiskScore !== undefined && district.RiskScore !== null
          ? Number(district.RiskScore).toFixed(1)
          : null;
      const hotspot = district.Hotspot || null;

      container.innerHTML = `<b>${district.NAME_2}</b><br>Province: ${provinceName}`;
      if (risk) {
        container.innerHTML +=
          `<br><small>Risk: <strong>${risk}</strong>` +
          (hotspot ? ` &middot; ${hotspot}` : "") +
          `</small>`;
      }
    } else {
      container.innerHTML = "";
    }
  }, [district]);

  return null;
};

// Small legend control that explains RiskScore color mapping
const LegendControl = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "map-legend");
      div.innerHTML = `
        <div style="font-weight:600; margin-bottom:6px">Risk score</div>
  <div><span style="display:inline-block;width:16px;height:12px;background:#b10026;margin-right:8px;"></span>Highest (>=40)</div>
        <div><span style="display:inline-block;width:16px;height:12px;background:#e31a1c;margin-right:8px;"></span>High (25–39)</div>
        <div><span style="display:inline-block;width:16px;height:12px;background:#fd8d3c;margin-right:8px;"></span>Moderate (15–24)</div>
        <div><span style="display:inline-block;width:16px;height:12px;background:#31a354;margin-right:8px;"></span>Low (&lt;15)</div>
      `;
      return div;
    };

    legend.addTo(map);
    return () => legend.remove();
  }, [map]);

  return null;
};

// Map a numeric RiskScore to a color used on the map
const getColorForRisk = (score) => {
  if (score === null || score === undefined || isNaN(Number(score)))
    return "#cccccc";
  const s = Number(score);
  if (s >= 40) return "#b10026"; // deep red
  if (s >= 25) return "#e31a1c"; // red
  if (s >= 15) return "#fd8d3c"; // orange
  return "#31a354"; // green
};

const RwandaMap = () => {
  const [districts, setDistricts] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const miniMapRef = useRef(null);
  const miniMapInstanceRef = useRef(null);

  useEffect(() => {
    // Fetch the districts GeoJSON from the public/ folder using an absolute path.
    // Use response.ok guard to avoid trying to parse HTML error pages as JSON.
    fetch("/rwanda_districts.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        // if features already contain RiskScore values, use them as-is.
        const hasRisk =
          data &&
          data.features &&
          data.features.some(
            (f) => f.properties && f.properties.RiskScore !== undefined
          );

        if (hasRisk) {
          setDistricts(data);
          return;
        }

        // Otherwise, try to enrich features by fetching the district analytics JSON
        // and matching on district name (feature.properties.NAME_2 <-> analytics.District).
        fetch("/data/district_analytics.json")
          .then((r) => (r.ok ? r.json() : Promise.resolve([])))
          .then((analytics) => {
            try {
              const lookup = {};
              const normalize = (s) =>
                (s || "").toString().trim().toLowerCase();
              (analytics || []).forEach((d) => {
                lookup[normalize(d.District)] = d;
              });

              const enriched = Object.assign({}, data);
              if (enriched.features && Array.isArray(enriched.features)) {
                enriched.features = enriched.features.map((f) => {
                  const ft = Object.assign({}, f);
                  const name = normalize(
                    (ft.properties &&
                      (ft.properties.NAME_2 || ft.properties.NAME_2)) ||
                      (ft.properties && ft.properties.NAME_2)
                  );
                  const match = lookup[name];
                  if (match) {
                    ft.properties = Object.assign({}, ft.properties, {
                      RiskScore: match.RiskScore,
                      Hotspot: match.Hotspot,
                      Stunting_Rate: match.Stunting_Rate,
                      Wasting_Rate: match.Wasting_Rate,
                      Underweight_Rate: match.Underweight_Rate,
                      Recommendations: match.Recommendations,
                    });
                  }
                  return ft;
                });
              }

              setDistricts(enriched);
            } catch (e) {
              console.warn("Could not enrich districts with analytics:", e);
              setDistricts(data);
            }
          })
          .catch(() => {
            // analytics not available; still set raw data so map loads
            setDistricts(data);
          });
      })
      .catch((error) => console.error("Error loading districts data:", error));
  }, []);

  // Fit map to districts bounds after they load. We'll use a small effect
  // that searches for the Leaflet map instance created by MapContainer.
  useEffect(() => {
    if (!districts) return;

    // find the Leaflet map instance on the page
    const mapEl = document.querySelector(".leaflet-container");
    if (!mapEl) return;

    // If the Map object is attached to the element, use it; otherwise
    // rely on Leaflet's global map registry via the element's _leaflet_map
    // property which react-leaflet sets.
    const map = mapEl._leaflet_map || null;
    if (!map) return;

    try {
      const layer = L.geoJSON(districts);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        // tighter padding and higher max zoom so the map zooms in closer
        // use flyToBounds for a smoother transition
        map.flyToBounds(bounds, {
          padding: [12, 12],
          maxZoom: 16,
          duration: 0.6,
        });
      }
    } catch (e) {
      console.warn("Could not fit map to districts bounds:", e);
    }
  }, [districts]);

  useEffect(() => {
    if (modalVisible && selectedDistrict && miniMapRef.current) {
      // Clear previous map if it exists
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
      }

      // Create mini map
      setTimeout(() => {
        const miniMap = L.map(miniMapRef.current, {
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
        });

        // match mini-map background to page
        if (miniMapRef.current) {
          const bg = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--color-primary-50");
          miniMapRef.current.style.background = bg || "var(--color-primary-50)";
        }

        // Add district to mini map
        const miniLayer = L.geoJSON(selectedDistrict, {
          style: () => {
            const score = selectedDistrict.properties.RiskScore;
            return {
              fillColor: getColorForRisk(score),
              weight: 2,
              color: "#444",
              fillOpacity: 0.9,
            };
          },
        }).addTo(miniMap);

        miniMap.fitBounds(miniLayer.getBounds(), { padding: [20, 20] });
        miniMapInstanceRef.current = miniMap;
      }, 50);
    }

    return () => {
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }
    };
  }, [modalVisible, selectedDistrict]);

  const getDistrictStyle = (feature) => {
    const provinceName =
      provinceNameMap[feature.properties.NAME_1] || feature.properties.NAME_1;
    return {
      // color by RiskScore when available, otherwise fall back to province color
      fillColor:
        (feature.properties && getColorForRisk(feature.properties.RiskScore)) ||
        provinceColors[provinceName] ||
        "#999",
      weight: 1.5,
      opacity: 1,
      color: "white",
      dashArray: "2",
      fillOpacity: 0.8,
    };
  };
  const onEachDistrict = (feature, layer) => {
    layer.on({
      mouseover: () => {
        layer.setStyle({
          weight: 3,
          color: "#666",
          fillOpacity: 0.9,
        });
        layer.bringToFront();
        setHoveredDistrict(feature.properties);
      },
      mouseout: () => {
        layer.setStyle(getDistrictStyle(feature));
        setHoveredDistrict(null);
      },
      click: () => {
        setSelectedDistrict(feature);
        setModalVisible(true);
      },
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDistrict(null);
  };

  return (
    <div className="rwanda-map-container">
      <MapContainer
        className="rwanda-leaflet-container"
        center={[-1.94, 29.87]}
        zoom={9.3}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        style={{
          height: "100vh",
          width: "100%",
          background: "var(--color-primary-900)",
        }}
        maxZoom={14}
      >
        <InfoControl district={hoveredDistrict} />
        <LegendControl />

        {districts && (
          <GeoJSON
            data={districts}
            style={getDistrictStyle}
            onEachFeature={onEachDistrict}
            smoothFactor={1.5}
          />
        )}
      </MapContainer>

      {modalVisible && selectedDistrict && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedDistrict.properties.NAME_2} District</h2>
            <div className="modal-grid">
              <div className="district-info">
                <div>
                  <span className="property-name">Province:</span>{" "}
                  {provinceNameMap[selectedDistrict.properties.NAME_1] ||
                    selectedDistrict.properties.NAME_1}
                </div>
                <div>
                  <span className="property-name">Type:</span>{" "}
                  {selectedDistrict.properties.TYPE_2}
                </div>
                {/* removed verbose geo metadata (CC_2, COUNTRY, HASC_2, GID_2) per UX request */}
                {/* Analytics block: non-intrusive, shows key metrics if available */}
                {(selectedDistrict.properties.RiskScore ||
                  selectedDistrict.properties.Hotspot ||
                  selectedDistrict.properties.Stunting_Rate) && (
                  <div className="analytics-block" style={{ marginTop: 12 }}>
                    <h4 style={{ margin: "6px 0" }}>Analytics</h4>
                    <div>
                      <strong>Risk Score:</strong>{" "}
                      {selectedDistrict.properties.RiskScore
                        ? Number(selectedDistrict.properties.RiskScore).toFixed(
                            1
                          )
                        : "—"}
                    </div>
                    <div>
                      <strong>Hotspot:</strong>{" "}
                      {selectedDistrict.properties.Hotspot || "—"}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <em>Rates</em>
                      <div>
                        Stunting:{" "}
                        {selectedDistrict.properties.Stunting_Rate ?? "—"}%
                      </div>
                      <div>
                        Wasting:{" "}
                        {selectedDistrict.properties.Wasting_Rate ?? "—"}%
                      </div>
                      <div>
                        Underweight:{" "}
                        {selectedDistrict.properties.Underweight_Rate ?? "—"}%
                      </div>
                    </div>
                    {Array.isArray(
                      selectedDistrict.properties.Recommendations
                    ) && (
                      <div style={{ marginTop: 8 }}>
                        <em>Recommendations</em>
                        <ul style={{ margin: "6px 0 0 18px" }}>
                          {selectedDistrict.properties.Recommendations.map(
                            (r, i) => (
                              <li key={i}>{r}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="district-map" ref={miniMapRef}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RwandaMap;
