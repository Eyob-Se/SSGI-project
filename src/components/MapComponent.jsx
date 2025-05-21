import React, { useEffect, useRef, useState } from "react";
import { Circle as CircleStyle } from "ol/style"; // Required for point styling

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
import {
  ZoomToExtent,
  ScaleLine,
  MousePosition,
  ZoomSlider,
  FullScreen,
} from "ol/control";
import { createStringXY } from "ol/coordinate";
import Overlay from "ol/Overlay";
import { Layers, Globe2, Square, MapPin, Search } from "lucide-react";

// Import custom components
import MapControls from "./MapControls";
import LayerPanel from "./LayerPanel";
import MeasurementTools from "./MeasurementTools";

/**
 * Main map component that handles the OpenLayers map instance and controls
 * Includes layer management, measurement tools, and map navigation
 */
const MapComponent = () => {
  // Refs and state management
  const mapRef = useRef(); // Reference to the map container div
  const mapInstance = useRef(null); // Reference to the OpenLayers map instance
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [showMeasurementTools, setShowMeasurementTools] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("osm");

  // Layer configuration state
  const [layers, setLayers] = useState([
    {
      id: "admin",
      name: "Administrative Boundaries",
      visible: true,
      opacity: 1,
    },
    /*  { id: "cities", name: "Cities & Towns", visible: true, opacity: 1 },
    { id: "roads", name: "Road Networks", visible: true, opacity: 1 },
    { id: "water", name: "Water Bodies", visible: true, opacity: 1 },
    { id: "pois", name: "Points of Interest", visible: false, opacity: 1 }, */
    { id: "zero", name: "Zero Order", visible: false, opacity: 1 },
    { id: "first", name: "First Order", visible: false, opacity: 1 },
  ]);

  // Initialize map on component mount
  useEffect(() => {
    if (!mapInstance.current) {
      // Set center coordinates to Addis Ababa, Ethiopia
      const ethiopiaCenter = fromLonLat([38.7578, 9.0222]);

      // Create base layers
      const osmLayer = new TileLayer({
        source: new OSM(),
        visible: selectedBasemap === "osm",
        zIndex: 0,
        title: "OSM",
      });

      // Zero Order Points Layer
      const zeroOrderLayer = new VectorLayer({
        source: new VectorSource({
          url: "",
          format: new GeoJSON(),
        }),
        visible: false,
        title: "Zero Order",
        zIndex: 2,
      });

      // First Order Points Layer
      const firstOrderLayer = new VectorLayer({
        source: new VectorSource({
          url: "",
          format: new GeoJSON(),
        }),
        visible: false,
        title: "First Order",
        zIndex: 2,
      });

      // Satellite imagery layer
      const satelliteLayer = new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          maxZoom: 19,
        }),
        visible: selectedBasemap === "satellite",
        zIndex: 0,
        title: "Satellite",
      });

      // Terrain layer
      const terrainLayer = new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
          maxZoom: 19,
        }),
        visible: selectedBasemap === "terrain",
        zIndex: 0,
        title: "Terrain",
      });

      // Streets layer
      const streetsLayer = new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          maxZoom: 19,
        }),
        visible: selectedBasemap === "streets",
        zIndex: 0,
        title: "Streets",
      });

      // Style for road sign points
      const roadSignStyle = new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: "#2ecc71" }),
          stroke: new Stroke({ color: "#ffffff", width: 1.5 }),
        }),
      });

      // Road signs vector layer
      const roadSignsLayer = new VectorLayer({
        source: new VectorSource({
          url: "/road_signs_2_30.json", // must be in public/ folder
          format: new GeoJSON(),
        }),
        style: roadSignStyle,
        visible: true,
        zIndex: 3,
        title: "Road Signs",
      });

      // Style for road sign points
      const roadSignStyle2 = new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: "blue" }),
          stroke: new Stroke({ color: "#ffffff", width: 1.5 }),
        }),
      });

      // Road signs vector layer
      const roadSignsLayer2 = new VectorLayer({
        source: new VectorSource({
          url: "/road_signs_31_60.json", // must be in public/ folder
          format: new GeoJSON(),
        }),
        style: roadSignStyle2,
        visible: true,
        zIndex: 3,
        title: "Road Signs",
      });

      // Style for Ethiopia boundary
      const ethiopiaStyle = new Style({
        fill: new Fill({
          color: "rgba(26, 126, 118, 0.1)",
        }),
        stroke: new Stroke({
          color: "#1a7e76",
          width: 2,
        }),
      });

      // Ethiopia boundary vector layer
      const ethiopiaBoundary = new VectorLayer({
        source: new VectorSource({
          url: "https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson",
          format: new GeoJSON(),
        }),
        style: function (feature) {
          // Only style Ethiopia's boundary
          if (feature.get("iso_a3") === "ETH") {
            return ethiopiaStyle;
          }
          return null;
        },
        zIndex: 1,
        title: "Ethiopia",
      });

      // Initialize OpenLayers map
      const map = new Map({
        target: mapRef.current,
        layers: [
          osmLayer,
          satelliteLayer,
          terrainLayer,
          streetsLayer,
          ethiopiaBoundary,
          zeroOrderLayer,
          firstOrderLayer,
          roadSignsLayer,
          roadSignsLayer2,
        ],
        view: new View({
          center: ethiopiaCenter,
          zoom: 6,
          maxZoom: 19,
          minZoom: 4,
        }),
        // Add default controls and custom controls
        controls: defaultControls().extend([
          new ScaleLine(),
          new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: "EPSG:4326",
            className: "custom-mouse-position",
            target: document.getElementById("mouse-position"),
          }),
          new ZoomSlider(),
          new FullScreen(),
          new ZoomToExtent({
            extent: [3700000, 1000000, 4700000, 1300000],
          }),
        ]),
      });

      mapInstance.current = map;
    }

    // Cleanup function to destroy map on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, []);

  // Update basemap when selection changes
  useEffect(() => {
    if (mapInstance.current) {
      const layers = mapInstance.current.getLayers().getArray();
      layers.forEach((layer) => {
        if (layer instanceof TileLayer) {
          const title = layer.get("title");
          if (
            title === "OSM" ||
            title === "Satellite" ||
            title === "Terrain" ||
            title === "Streets"
          ) {
            layer.setVisible(title.toLowerCase() === selectedBasemap);
          }
        }
      });
    }
  }, [selectedBasemap]);

  // Toggle handlers for panels
  const toggleLayerPanel = () => {
    setShowLayerPanel(!showLayerPanel);
    if (showMeasurementTools) setShowMeasurementTools(false);
  };

  const toggleMeasurementTools = () => {
    setShowMeasurementTools(!showMeasurementTools);
    if (showLayerPanel) setShowLayerPanel(false);
  };

  // Handler for changing basemap
  const changeBasemap = (basemap) => {
    setSelectedBasemap(basemap);
  };

  // Handler for layer property changes
  const handleLayerChange = (layerId, property, value) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, [property]: value } : layer
      )
    );
  };

  return (
    <div className="relative h-full w-full">
      {/* Map container */}
      <div ref={mapRef} className="map"></div>

      {/* Map Controls */}
      <MapControls
        onLayersClick={toggleLayerPanel}
        onMeasureClick={toggleMeasurementTools}
        selectedBasemap={selectedBasemap}
        onBasemapChange={changeBasemap}
      />

      {/* Mouse position display */}
      <div
        id="mouse-position"
        className="absolute bottom-0 right-0 bg-white/80 px-2 py-1 text-sm rounded-tl-md border-t border-l border-gray-300"
      ></div>

      {/* Layer Panel */}
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

      {/* Measurement Tools */}
      <motion.div
        className="absolute top-4 left-4 bg-white rounded-lg shadow-lg z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: showMeasurementTools ? 1 : 0,
          x: showMeasurementTools ? 0 : -20,
          pointerEvents: showMeasurementTools ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
      >
        <MeasurementTools
          map={mapInstance.current}
          onClose={() => setShowMeasurementTools(false)}
        />
      </motion.div>
    </div>
  );
};

export default MapComponent;
