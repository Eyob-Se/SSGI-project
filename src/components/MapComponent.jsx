import React, { useEffect, useRef, useState } from "react";
import { Circle as CircleStyle } from "ol/style";
import { motion } from "framer-motion";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { Fill, Stroke, Style } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import { defaults as defaultControls } from "ol/control";
import { ScaleLine, MousePosition, FullScreen } from "ol/control";
import { createStringXY } from "ol/coordinate";
import Overlay from "ol/Overlay";
import MapControls from "./MapControls";
import LayerPanel from "./LayerPanel";
import Legend from "./Legend";
import DataRequestModal from "./DataRequestModal"; // import modal

const MapComponent = () => {
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const layerRefs = useRef({});
  const popupRef = useRef();
  const popupOverlayRef = useRef(null); // Keep a ref for popup overlay
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("osm");
  const [showDataModal, setShowDataModal] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState("");

  const [layers, setLayers] = useState([
    {
      id: "zero",
      name: "Zero Order",
      visible: true,
      opacity: 1,
      color: "#ea580c",
    },
    {
      id: "first",
      name: "First Order",
      visible: true,
      opacity: 1,
      color: "#312e81",
    },
    {
      id: "ethiopiaBoundary",
      name: "Boundary",
      visible: true,
      opacity: 1,
      color: "#1a7e76",
    },
  ]);

  useEffect(() => {
    if (!mapInstance.current) {
      const ethiopiaCenter = fromLonLat([38.7578, 9.0222]);

      const osmLayer = new TileLayer({
        source: new OSM(),
        visible: selectedBasemap === "osm",
        zIndex: 0,
        title: "OSM",
      });

      const satelliteLayer = new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          maxZoom: 19,
        }),
        visible: selectedBasemap === "satellite",
        zIndex: 0,
        title: "Satellite",
      });

      const roadSignStyle = new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: "#ea580c" }),
          stroke: new Stroke({ color: "#ffffff", width: 1.5 }),
        }),
      });

      const zero_order = new VectorLayer({
        source: new VectorSource({
          url: "http://localhost:8000/api/geo",
          format: new GeoJSON(),
        }),
        style: roadSignStyle,
        visible: true,
        zIndex: 3,
        title: "zero",
      });
      layerRefs.current["zero"] = zero_order;

      const roadSignStyle2 = new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: "#312e81" }),
          stroke: new Stroke({ color: "#ffffff", width: 1.5 }),
        }),
      });

      const first_order = new VectorLayer({
        source: new VectorSource({
          url: "http://localhost:8000/api/geo1",
          format: new GeoJSON(),
        }),
        style: roadSignStyle2,
        visible: true,
        zIndex: 3,
        title: "first",
      });
      layerRefs.current["first"] = first_order;

      const ethiopiaStyle = new Style({
        fill: new Fill({ color: "rgba(26, 126, 118, 0.1)" }),
        stroke: new Stroke({ color: "#1a7e76", width: 2 }),
      });

      const ethiopiaBoundary = new VectorLayer({
        source: new VectorSource({
          url: "http://localhost:8000/api/geo_eth",
          format: new GeoJSON(),
        }),
        style: ethiopiaStyle,
        visible: true,
        zIndex: 1,
        title: "Ethiopia Boundary",
      });
      layerRefs.current["ethiopiaBoundary"] = ethiopiaBoundary;

      const map = new Map({
        target: mapRef.current,
        layers: [
          osmLayer,
          satelliteLayer,
          ethiopiaBoundary,
          zero_order,
          first_order,
        ],
        view: new View({
          center: ethiopiaCenter,
          zoom: 6.7,
          maxZoom: 19,
          minZoom: 4,
        }),
        controls: defaultControls().extend([
          new ScaleLine(),
          // new MousePosition({
          //   coordinateFormat: createStringXY(4),
          //   projection: "EPSG:4326",
          //   className: "custom-mouse-position",
          // }),
          new FullScreen(),
        ]),
      });

      mapInstance.current = map;

      const popupOverlay = new Overlay({
        element: popupRef.current,
        positioning: "bottom-center",
        stopEvent: false,
        offset: [0, -12],
      });
      map.addOverlay(popupOverlay);
      popupOverlayRef.current = popupOverlay; // save ref for later use

      // Pointer move: show popup only on Point features, hide otherwise
      map.on("pointermove", (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
        if (feature && feature.getGeometry().getType() === "Point") {
          mapRef.current.style.cursor = "pointer";
          const coordinates = event.coordinate;
          const pointId = feature.get("id");
          const popupContent = `
  <div class="bg-white p-3 shadow-lg rounded-xl border border-gray-300 text-sm max-w-sm w-64 transition-opacity duration-300">
    <p class="text-gray-900 font-bold text-base mb-1">&#128752; Point ID: <span class="text-indigo-700">${
      pointId || "Unknown"
    }</span></p>
    <p class="text-gray-600 italic text-xs">Click if you want to request this data</p>
  </div>
`;

          popupRef.current.innerHTML = popupContent;
          popupOverlay.setPosition(coordinates);
          popupRef.current.style.display = "block";
        } else {
          mapRef.current.style.cursor = "";
          popupRef.current.style.display = "none";
          popupOverlay.setPosition(undefined);
        }
      });

      // Single click: open modal only for Point features
      map.on("singleclick", (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
        if (feature && feature.getGeometry().getType() === "Point") {
          const pointId = feature.get("id") || "Unknown ID";
          setSelectedPointId(pointId);
          setShowDataModal(true);
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      const layers = mapInstance.current.getLayers().getArray();
      layers.forEach((layer) => {
        if (layer instanceof TileLayer) {
          const title = layer.get("title");
          layer.setVisible(title.toLowerCase() === selectedBasemap);
        }
      });
    }
  }, [selectedBasemap]);

  useEffect(() => {
    layers.forEach((layer) => {
      const olLayer = layerRefs.current[layer.id];
      if (olLayer) {
        olLayer.setVisible(layer.visible);
        olLayer.setOpacity(layer.opacity);
      }
    });
  }, [layers]);

  const toggleLayerPanel = () => {
    setShowLayerPanel(!showLayerPanel);
  };

  const changeBasemap = (basemap) => {
    setSelectedBasemap(basemap);
  };

  const handleLayerChange = (layerId, property, value) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, [property]: value } : layer
      )
    );
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="map"></div>
      <div
        ref={popupRef}
        className="absolute z-50 pointer-events-none"
        style={{ display: "none" }}
      ></div>

      <MapControls
        onLayersClick={toggleLayerPanel}
        selectedBasemap={selectedBasemap}
        onBasemapChange={changeBasemap}
      />

      <motion.div
        className="absolute top-4 right-4 bg-white rounded-lg shadow-lg z-10 max-w-xs w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: showLayerPanel ? 1 : 0,
          x: showLayerPanel ? 0 : 20,
          pointerEvents: showLayerPanel ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
      >
        <LayerPanel
          layers={layers}
          onLayerChange={handleLayerChange}
          onClose={() => setShowLayerPanel(false)}
        />
      </motion.div>

      <div className="absolute top-[16rem] font-[poppins] left-4 z-10">
        <Legend layers={layers} />
      </div>

      {/* Modal */}
      <DataRequestModal
        show={showDataModal}
        onClose={() => setShowDataModal(false)}
        pointId={selectedPointId}
      />
    </div>
  );
};

export default MapComponent;
