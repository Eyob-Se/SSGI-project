import React from "react";
import { motion } from "framer-motion";
import MapComponent from "../components/MapComponent";
import { MapIcon, Map, Globe, Database, Award } from "lucide-react";
import { use } from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <motion.div
        className="h-[calc(100vh-64px)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MapComponent />
      </motion.div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2
          className="text-2xl font-semibold font-[poppins] text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Key Features of the CORS System
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <motion.div
            className="card"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Map className="h-10 w-10 text-indigo-900 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Interactive Mapping</h3>
            <p className="text-gray-600">
              Explore Ethiopia's geodetic network through our interactive WebGIS
              interface. Navigate the map, search for control points, and access
              detailed information about each point in the network.
            </p>
          </motion.div>

          <motion.div
            className="card"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Database className="h-10 w-10 text-indigo-900 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Comprehensive Database
            </h3>
            <p className="text-gray-600">
              Access a complete database of geodetic control points throughout
              Ethiopia, including horizontal and vertical control networks, with
              detailed metadata and technical specifications for each point.
            </p>
          </motion.div>

          <motion.div
            className="card"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Award className="h-10 w-10 text-indigo-900 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
            <p className="text-gray-600">
              All geodetic control points in our system undergo rigorous quality
              control to ensure accuracy and reliability. Each point is
              documented with information about its establishment, maintenance
              history, and accuracy metrics.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Home;
