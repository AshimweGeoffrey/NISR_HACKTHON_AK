// RwandaMap.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, GeoJSON, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "..styles/rwandaMap.css";

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

  useEffect(() => {
    const info = L.control();

    info.onAdd = () => {
      const div = L.DomUtil.create("div", "info-panel");
      updateContent(div);
      return div;
    };

    const updateContent = (div) => {
      if (district) {
        const provinceName =
          provinceNameMap[district.NAME_1] || district.NAME_1;
        div.innerHTML = `<b>${district.NAME_2}</b><br>Province: ${provinceName}`;
      } else {
        div.innerHTML = "";
      }
    };

    info.addTo(map);

    return () => {
      info.remove();
    };
  }, [map]);

  useEffect(() => {
    const container = document.querySelector(".info-panel");
    if (container) {
      if (district) {
        const provinceName =
          provinceNameMap[district.NAME_1] || district.NAME_1;
        container.innerHTML = `<b>${district.NAME_2}</b><br>Province: ${provinceName}`;
      } else {
        container.innerHTML = "";
      }
    }
  }, [district]);

  return null;
};

const RwandaMap = () => {
  const [districts, setDistricts] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const miniMapRef = useRef(null);
  const miniMapInstanceRef = useRef(null);

  useEffect(() => {
    fetch("rwanda_districts.json")
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error("Error loading districts data:", error));
  }, []);

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

        // Add district to mini map
        const miniLayer = L.geoJSON(selectedDistrict, {
          style: {
            fillColor:
              provinceColors[
                provinceNameMap[selectedDistrict.properties.NAME_1] ||
                  selectedDistrict.properties.NAME_1
              ],
            weight: 2,
            color: "#444",
            fillOpacity: 0.8,
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
      fillColor: provinceColors[provinceName] || "#999",
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
        center={[-1.94, 29.87]}
        zoom={8}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        style={{ height: "100vh", width: "100%" }}
      >
        <InfoControl district={hoveredDistrict} />

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
                <div>
                  <span className="property-name">Code:</span>{" "}
                  {selectedDistrict.properties.CC_2}
                </div>
                <div>
                  <span className="property-name">Country:</span>{" "}
                  {selectedDistrict.properties.COUNTRY}
                </div>
                <div>
                  <span className="property-name">HASC Code:</span>{" "}
                  {selectedDistrict.properties.HASC_2}
                </div>
                <div>
                  <span className="property-name">Global ID:</span>{" "}
                  {selectedDistrict.properties.GID_2}
                </div>
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
