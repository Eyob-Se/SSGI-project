import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Ruler, Square, MapPin } from "lucide-react";
import Draw from "ol/interaction/Draw";
import Overlay from "ol/Overlay";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { getArea, getLength } from "ol/sphere";
import { unByKey } from "ol/Observable";

const MeasurementTools = ({ map, onClose }) => {
  const [activeTool, setActiveTool] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [measureSource, setMeasureSource] = useState(null);
  const [measureLayer, setMeasureLayer] = useState(null);
  const [draw, setDraw] = useState(null);

  useEffect(() => {
    if (!map) return;

    // Create vector source and layer for measurements
    const source = new VectorSource();
    const vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: "rgba(249, 115, 22, 0.2)",
        }),
        stroke: new Stroke({
          color: "#f97316",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: "#f97316",
          }),
          fill: new Fill({
            color: "rgba(249, 115, 22, 0.2)",
          }),
        }),
      }),
    });

    map.addLayer(vector);
    setMeasureSource(source);
    setMeasureLayer(vector);

    return () => {
      if (map) {
        map.removeLayer(vector);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !measureSource || activeTool === null) return;

    // Clear previous measurement
    measureSource.clear();
    setMeasurement(null);

    // Remove previous interaction
    if (draw) {
      map.removeInteraction(draw);
    }

    let measureType = null;
    if (activeTool === "distance") {
      measureType = "LineString";
    } else if (activeTool === "area") {
      measureType = "Polygon";
    } else if (activeTool === "point") {
      measureType = "Point";
    }

    if (!measureType) return;

    // Create new draw interaction
    const drawInteraction = new Draw({
      source: measureSource,
      type: measureType,
      style: new Style({
        fill: new Fill({
          color: "rgba(249, 115, 22, 0.1)",
        }),
        stroke: new Stroke({
          color: "#f97316",
          lineDash: [10, 10],
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: "#f97316",
          }),
          fill: new Fill({
            color: "#f97316",
          }),
        }),
      }),
    });

    let listener;
    drawInteraction.on("drawstart", function (evt) {
      // Clear previous measurement
      measureSource.clear();
      setMeasurement(null);

      // Set up measurement listener
      let measureValue = null;
      listener = evt.feature.getGeometry().on("change", function (e) {
        const geom = e.target;
        if (measureType === "LineString") {
          measureValue = getLength(geom);
          setMeasurement(formatLength(measureValue));
        } else if (measureType === "Polygon") {
          measureValue = getArea(geom);
          setMeasurement(formatArea(measureValue));
        } else if (measureType === "Point") {
          const coords = geom.getCoordinates();
          setMeasurement(
            `Lon: ${coords[0].toFixed(6)}, Lat: ${coords[1].toFixed(6)}`
          );
        }
      });
    });

    drawInteraction.on("drawend", function () {
      if (listener) {
        unByKey(listener);
      }
    });

    map.addInteraction(drawInteraction);
    setDraw(drawInteraction);

    return () => {
      if (map && drawInteraction) {
        map.removeInteraction(drawInteraction);
      }
    };
  }, [map, measureSource, activeTool]);

  const formatLength = (length) => {
    let output;
    if (length > 1000) {
      output = `${(length / 1000).toFixed(2)} km`;
    } else {
      output = `${length.toFixed(2)} m`;
    }
    return output;
  };

  const formatArea = (area) => {
    let output;
    if (area > 10000) {
      output = `${(area / 1000000).toFixed(2)} km²`;
    } else {
      output = `${area.toFixed(2)} m²`;
    }
    return output;
  };

  const handleToolSelect = (tool) => {
    if (activeTool === tool) {
      setActiveTool(null);
    } else {
      setActiveTool(tool);
    }
  };

  const clearMeasurement = () => {
    if (measureSource) {
      measureSource.clear();
    }
    setMeasurement(null);
    setActiveTool(null);
    if (draw && map) {
      map.removeInteraction(draw);
      setDraw(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Ruler size={18} className="mr-2 text-indigo-900" />
          Measurement Tools
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => handleToolSelect("distance")}
          className={`p-2 flex flex-col items-center justify-center rounded-md border border-gray-200 ${
            activeTool === "distance"
              ? "bg-indigo-900 text-white"
              : "hover:bg-gray-50"
          }`}
        >
          <Ruler size={20} />
          <span className="text-xs mt-1">Distance</span>
        </button>

        <button
          onClick={() => handleToolSelect("area")}
          className={`p-2 flex flex-col items-center justify-center rounded-md border border-gray-200 ${
            activeTool === "area"
              ? "bg-indigo-900 text-white"
              : "hover:bg-gray-50"
          }`}
        >
          <Square size={20} />
          <span className="text-xs mt-1">Area</span>
        </button>

        <button
          onClick={() => handleToolSelect("point")}
          className={`p-2 flex flex-col items-center justify-center rounded-md border border-gray-200 ${
            activeTool === "point"
              ? "bg-indigo-900 text-white"
              : "hover:bg-gray-50"
          }`}
        >
          <MapPin size={20} />
          <span className="text-xs mt-1">Coordinate</span>
        </button>
      </div>

      {measurement && (
        <motion.div
          className="bg-gray-100 p-3 rounded-md"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {activeTool === "distance" && "Distance:"}
              {activeTool === "area" && "Area:"}
              {activeTool === "point" && "Coordinates:"}
            </span>
            <button
              onClick={clearMeasurement}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          </div>
          <div className="mt-1 text-sm">{measurement}</div>
        </motion.div>
      )}

      {activeTool && !measurement && (
        <p className="text-sm text-gray-500 italic">
          Click on the map to start measuring.
          {activeTool === "distance" && " Double-click to finish the line."}
          {activeTool === "area" && " Double-click to complete the polygon."}
        </p>
      )}
    </div>
  );
};

export default MeasurementTools;
