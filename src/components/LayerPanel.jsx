import React from "react";
import { motion } from "framer-motion";
import { Layers, X, Eye, EyeOff } from "lucide-react";

const LayerPanel = ({ layers, onLayerChange, onClose }) => {
  const handleVisibilityToggle = (layerId) => {
    const layer = layers.find((l) => l.id === layerId);
    onLayerChange(layerId, "visible", !layer.visible);
  };

  const handleOpacityChange = (layerId, opacity) => {
    onLayerChange(layerId, "opacity", opacity);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Layers size={18} className="mr-2 text-indigo-900" />
          Layer Controls
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {layers.map((layer) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-gray-200 rounded-md p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{layer.name}</span>
              <button
                onClick={() => handleVisibilityToggle(layer.id)}
                className={`p-1 rounded-full ${
                  layer.visible ? "text-indigo-900" : "text-gray-400"
                }`}
              >
                {layer.visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="flex items-center">
              <span className="text-xs text-gray-500 w-10">Opacity</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={layer.opacity}
                onChange={(e) =>
                  handleOpacityChange(layer.id, parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={!layer.visible}
              />
              <span className="text-xs text-gray-500 w-8 text-right">
                {Math.round(layer.opacity * 100)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;
