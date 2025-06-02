import React from "react";
import { motion } from "framer-motion";
import { Layers, X, Eye, EyeOff } from "lucide-react";

const LayerPanel = ({ layers, onLayerChange, onClose }) => {
  const handleVisibilityToggle = (layerId) => {
    const layer = layers.find((l) => l.id === layerId);
    onLayerChange(layerId, "visible", !layer.visible);
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
              <label className="flex items-center space-x-2 font-medium">
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => handleVisibilityToggle(layer.id)}
                  className="accent-indigo-900"
                />
                <span>{layer.name}</span>
              </label>
              <span className="font-medium">{layer.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;
