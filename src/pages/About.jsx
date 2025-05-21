import React from "react";
import { motion } from "framer-motion";
import {
  MapIcon,
  Map,
  Globe,
  Database,
  Award,
  SatelliteDish,
} from "lucide-react";

const About = () => {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center font-[poppins] mb-12">
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          About CORS System
        </motion.h1>
        <motion.p
          className="max-w-2xl mx-auto text-lg text-gray-600"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Ethiopia's Comprehensive Geodetic Control Points Information System
        </motion.p>
      </div>

      <motion.div
        className="card p-6 shadow-lg border rounded-lg mb-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4 flex items-center">
          <div className="bg-gradient-to-bl from-blue-900 to-orange-600 rounded-full p-3 mr-3">
            <MapIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-900 font-[poppins]">
            What is the CORS System?
          </h2>
        </div>
        <p className="text-gray-700 mb-3 leading-relaxed">
          The CORS (Continuously Operating Reference Stations) System is a
          network of permanently installed GNSS (Global Navigation Satellite
          System) reference stations distributed across Ethiopia. These stations
          provide real-time, high-precision positioning data to support
          geodetic, cadastral, and engineering applications. By continuously
          collecting satellite signals, the CORS System ensures centimeter-level
          accuracy and long-term data integrity for professional surveying and
          mapping needs.
        </p>
        <p className="text-gray-700 leading-relaxed">
          The system is designed to serve a wide range of users, including
          government agencies, infrastructure developers, researchers, and
          private sector professionals. With reliable geospatial data and
          consistent access, the CORS System plays a vital role in enhancing the
          country's spatial data infrastructure and enabling smart
          decision-making for sustainable development.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div
          className="card"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-4 flex items-center">
            <div className="bg-indigo-900 rounded-full p-3 mr-4">
              <SatelliteDish className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Our Mission</h2>
          </div>
          <p className="text-gray-600">
            The CORS System provides access to Ethiopia's geodetic control point
            network, offering essential geographic reference data for surveying,
            engineering, and geographic information systems throughout the
            country. Our mission is to maintain a comprehensive, accurate, and
            accessible geodetic framework for Ethiopia.
          </p>
        </motion.div>

        <motion.div
          className="card"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mb-4 flex items-center">
            <div className="bg-accent rounded-full p-3 mr-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Our Vision</h2>
          </div>
          <p className="text-gray-600">
            We envision a future where precise geospatial data is readily
            available to support Ethiopia's development in infrastructure, urban
            planning, natural resource management, and environmental protection.
            Our goal is to provide the most accurate and reliable geodetic
            framework possible for the nation.
          </p>
        </motion.div>
      </div>
      <motion.div
        className="bg-indigo-900 text-white font-[poppins] rounded-lg p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-6">
          For more information about the CORS System or to request specific
          geodetic data, please contact our team.
        </p>
        <div className="inline-block">
          <a href="/data-request" className="btn btn-accent inline-block">
            Submit a Data Request
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;

// import React, { useEffect, useRef, useState } from "react";
// import Map from "ol/Map";
// import View from "ol/View";
// import { fromLonLat } from "ol/proj";
// import "ol/ol.css";
// import TileLayer from "ol/layer/Tile";
// import LayerGroup from "ol/layer/Group";
// import OSM from "ol/source/OSM";
// import TileWMS from "ol/source/TileWMS";
// import XYZ from "ol/source/XYZ";
// import LayerSwitcher from "ol-layerswitcher";
// import "ol-layerswitcher/dist/ol-layerswitcher.css";

// function About() {
//   const mapRef = useRef(null);
//   const mapInstance = useRef(null);
//   const modalRef = useRef(null);
//   const [featureInfo, setFeatureInfo] = useState(null);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     const baseLayerGroup = new LayerGroup({
//       title: "Base Layers",
//       layers: [
//         new TileLayer({
//           source: new OSM(),
//           title: "OpenStreetMap",
//           visible: true,
//         }),
//         new TileLayer({
//           source: new XYZ({
//             url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
//           }),
//           title: "Satellite",
//           visible: false,
//         }),
//       ],
//     });

//     const hazardLayerGroup = new LayerGroup({
//       title: "Hazard Layers",
//       layers: [
//         new TileLayer({
//           source: new TileWMS({
//             url: "http://10.2.11.35:8010/geoserver/Green_Legacy/wms",
//             params: {
//               LAYERS: "Green_Legacy:GLI_1",
//               TILED: true,
//               FORMAT: "image/png",
//               TRANSPARENT: true,
//             },
//             serverType: "geoserver",
//           }),
//           title: "Drought",
//           visible: true,
//         }),
//         new TileLayer({
//           source: new TileWMS({
//             url: "http://10.2.11.35:8010/geoserver/Green_Legacy/wms",
//             params: {
//               LAYERS: "Green_Legacy:GLI_1",
//               TILED: true,
//               FORMAT: "image/png",
//               TRANSPARENT: true,
//             },
//             serverType: "geoserver",
//           }),
//           title: "Flood",
//           visible: true,
//         }),
//       ],
//     });

//     mapInstance.current = new Map({
//       target: mapRef.current,
//       layers: [baseLayerGroup, hazardLayerGroup],
//       view: new View({
//         center: fromLonLat([38.971861469308, 8.748207216169536]),
//         zoom: 5.7,
//       }),
//     });

//     const layerSwitcher = new LayerSwitcher({
//       reverse: true,
//       activationMode: "click",
//       groupSelectStyle: "children",
//     });
//     mapInstance.current.addControl(layerSwitcher);

//     return () => {
//       mapInstance.current.setTarget(null);
//     };
//   }, []);

//   return (
//     <>
//       <div
//         ref={mapRef}
//         className="map"
//         style={{ width: "85%", height: "500px" }}
//       ></div>
//     </>
//   );
// }

// export default About;
