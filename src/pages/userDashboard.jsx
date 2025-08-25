import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserDataDashboard = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user/points", {
          withCredentials: true,
        });

        // Flatten point_id arrays to individual point entries
        const expandedPoints = res.data.flatMap((entry) =>
          entry.point_id.map((id) => ({ point_id: id }))
        );

        setPoints(expandedPoints); // [{ point_id: '12' }, { point_id: '13' }, ...]
      } catch (error) {
        console.error("Failed to fetch user points:", error);
      }
    };

    fetchUserPoints();
  }, []);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-12 font-[Poppins]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Data Access
      </h1>

      {points.length === 0 ? (
        <p className="text-gray-600">No data available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {points.map((point, index) => (
            <motion.div
              key={`${point.point_id}-${index}`}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col justify-between"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <FolderOpen className="w-10 h-10 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Point ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {point.point_id}
                  </p>
                </div>
              </div>
              <Link
                to={`/points/${point.point_id}`}
                className="bg-indigo-800 text-white text-sm text-center px-4 py-2 rounded hover:bg-indigo-900 transition"
              >
                View
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UserDataDashboard;
