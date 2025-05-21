import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Map as MapIcon,
  Ruler,
  Maximize,
  Home,
  MapPin,
  Image,
} from "lucide-react";

/**
 * MapControls component provides the control buttons for map interaction
 * Includes layer controls, measurement tools, basemap selection, and navigation
 *
 * @param {Object} props - Component props
 * @param {Function} props.onLayersClick - Handler for layer panel toggle
 * @param {Function} props.onMeasureClick - Handler for measurement tools toggle
 * @param {string} props.selectedBasemap - Currently selected basemap
 * @param {Function} props.onBasemapChange - Handler for basemap changes
 */
const MapControls = ({
  onLayersClick,
  onMeasureClick,
  selectedBasemap,
  onBasemapChange,
}) => {
  return (
    <motion.div
      className="absolute top-4 right-4 z-10 flex flex-col gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2">
        {/* Layer control button */}
        <button
          onClick={onLayersClick}
          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          title="Layer Controls"
        >
          <Layers size={20} className="text-indigo-900" />
        </button>

        {/* Measurement tools button */}
        <button
          onClick={onMeasureClick}
          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          title="Measurement Tools"
        >
          <Ruler size={20} className="text-indigo-900" />
        </button>

        <hr className="border-gray-200 my-1" />

        {/* Basemap selection buttons */}
        <div className="flex flex-col gap-1" title="Basemap Selection">
          <button
            onClick={() => onBasemapChange("osm")}
            className={`w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors ${
              selectedBasemap === "osm"
                ? "bg-indigo-900 text-white hover:bg-indigo-900-dark"
                : ""
            }`}
            title="OpenStreetMap"
          >
            <MapIcon size={20} />
          </button>

          <button
            onClick={() => onBasemapChange("satellite")}
            className={`w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors ${
              selectedBasemap === "satellite"
                ? "bg-indigo-900 text-white hover:bg-blue-600"
                : ""
            }`}
            title="Satellite"
          >
            <Image size={20} />
          </button>

          <button
            onClick={() => onBasemapChange("terrain")}
            className={`w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors ${
              selectedBasemap === "terrain"
                ? "bg-indigo-900 text-white hover:bg-blue-600"
                : ""
            }`}
            title="Terrain"
          >
            <MapIcon size={20} className="opacity-70" />
          </button>

          <button
            onClick={() => onBasemapChange("streets")}
            className={`w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors ${
              selectedBasemap === "streets"
                ? "bg-indigo-900 text-white hover:bg-blue-600"
                : ""
            }`}
            title="Streets"
          >
            <MapIcon size={20} />
          </button>
        </div>

        <hr className="border-gray-200 my-1" />

        {/* Location and extent buttons */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          title="My Location"
        >
          <MapPin size={20} className="text-accent" />
        </button>

        <button
          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          title="Full Extent"
        >
          <Home size={20} className="text-indigo-900" />
        </button>
      </div>
    </motion.div>
  );
};

export default MapControls;
