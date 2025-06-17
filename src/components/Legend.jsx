import React from "react";
import { Circle, Compass } from "lucide-react"; // Import the desired icon

const Legend = ({ layers }) => {
  return (
    <div className="legend bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-bold text-lg mb-2 flex items-center">
        <Compass className="mr-2" size={20} /> {/* Add the icon here */}
        Legend
      </h3>
      <ul className="list-none text-sm">
        {layers.map((layer) => (
          <li key={layer.id} className="flex items-center mb-2">
            <Circle
              className="mr-2"
              style={{
                fill: layer.visible ? layer.color : "#e0e0e0", // Grey if not visible
                stroke: "none",
              }}
              size={16}
            />
            <span>{layer.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
