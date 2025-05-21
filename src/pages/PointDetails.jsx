import React, { useState } from "react";
import { motion } from "framer-motion";
import { Printer, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PointDetails = () => {
  const [pointData] = useState({
    id: "AA01",
    type: "First Order",
    location: "Addis Ababa, Goro",
    material: "Reinforced concrete",
    date: "2016/07/12",
    datum: "ADINDAN",
    wgs84: {
      easting: "482418.247",
      northing: "991093.347",
      ellipsoidHeight: "2243.944",
    },
    adindan: {
      easting: "482325.682",
      northing: "990886.297",
      orthoHeight: "2249.581",
    },
    projectionInfo: {
      type: "UTM",
      zone: "37",
      unit: "Meter",
      ellipsoid: "Clarke 1880",
      model: "EGM08",
      spacing: "1x1 minute",
      method: "bilinear",
    },
    accuracy: "0.002",
    images: [
      "https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/7969333/pexels-photo-7969333.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center text-blue-800 hover:text-blue-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Map</span>
        </Link>

        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="btn bg-indigo-800 text-white hover:bg-indigo-900 flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>

          <button className="btn bg-blue-600 text-white hover:bg-blue-800 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      <motion.div
        className="bg-white rounded-lg shadow-md p-6 print:shadow-none"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="border border-gray-300 rounded-lg overflow-hidden print:border-black">
          <div className="bg-gray-100 border-b border-gray-300 p-4 text-center print:bg-white print:border-black">
            <h1 className="text-2xl font-bold">
              Geodetic Control Point Description
            </h1>
          </div>

          <div className="grid grid-cols-1 divide-y divide-gray-300 print:divide-black">
            <div className="grid grid-cols-12 divide-x divide-gray-300 print:divide-black">
              <div className="col-span-4 p-3">
                <p>
                  <strong>GCP Type:</strong> {pointData.type}
                </p>
                <p>
                  <strong>GCP ID:</strong> {pointData.id}
                </p>
              </div>
              <div className="col-span-8 p-3">
                <p>
                  <strong>Location name:</strong> {pointData.location}
                </p>
                <p>
                  <strong>Nature of control point:</strong> {pointData.material}
                </p>
                <p>
                  <strong>Establishment date:</strong> {pointData.date}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 divide-x divide-gray-300 print:divide-black">
              <div className="col-span-4 p-3 text-center font-semibold bg-gray-50 print:bg-white">
                <p>WGS84</p>
              </div>
              <div className="col-span-4 p-3 text-center font-semibold">
                <p>ADINDAN</p>
              </div>
              <div className="col-span-4 p-3 text-center font-semibold bg-gray-50 print:bg-white">
                <p>Accuracy (m)</p>
                <p className="text-xs text-gray-500">(95 % C.I.)</p>
              </div>
            </div>

            <div className="grid grid-cols-12 divide-x divide-gray-300 print:divide-black">
              <div className="col-span-4 p-3">
                <p>
                  <strong>Easting =</strong> {pointData.wgs84.easting}
                </p>
              </div>
              <div className="col-span-4 p-3">
                <p>
                  <strong>Easting =</strong> {pointData.adindan.easting}
                </p>
              </div>
              <div className="col-span-4 p-3 text-center">
                {pointData.accuracy}
              </div>
            </div>

            <div className="grid grid-cols-12 divide-x divide-gray-300 print:divide-black">
              <div className="col-span-4 p-3">
                <p>
                  <strong>Northing =</strong> {pointData.wgs84.northing}
                </p>
              </div>
              <div className="col-span-4 p-3">
                <p>
                  <strong>Northing =</strong> {pointData.adindan.northing}
                </p>
              </div>
              <div className="col-span-4 p-3 text-center">
                {pointData.accuracy}
              </div>
            </div>

            <div className="grid grid-cols-12 divide-x divide-gray-300 print:divide-black">
              <div className="col-span-4 p-3">
                <p>
                  <strong>Ellipsoidal Height =</strong>{" "}
                  {pointData.wgs84.ellipsoidHeight}
                </p>
              </div>
              <div className="col-span-4 p-3">
                <p>
                  <strong>Orthometric Height =</strong>{" "}
                  {pointData.adindan.orthoHeight}
                </p>
              </div>
              <div className="col-span-4 p-3 text-center">
                {pointData.accuracy}
              </div>
            </div>

            <div className="grid grid-cols-12 divide-x divide-gray-300 print:divide-black">
              <div className="col-span-4 p-3">
                <p className="text-sm italic">
                  Note: The orthometric height is derived from the WGS84
                  ellipsoid.
                </p>
              </div>
              <div className="col-span-8 p-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Projection Type:</strong>{" "}
                      {pointData.projectionInfo.type}
                    </p>
                    <p>
                      <strong>Zone:</strong> {pointData.projectionInfo.zone}
                    </p>
                    <p>
                      <strong>Unit:</strong> {pointData.projectionInfo.unit}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>
                        WGS84 to Adindan Datum Transformation Parameters:
                      </strong>
                    </p>
                    <p className="text-sm">(ΔX: 162 ΔY: 12 ΔZ: -206)</p>
                    <p>
                      <strong>Ellipsoid:</strong>{" "}
                      {pointData.projectionInfo.ellipsoid}
                    </p>
                    <p>
                      <strong>Geoid Model:</strong>{" "}
                      {pointData.projectionInfo.model}
                    </p>
                    <p>
                      <strong>Grid spacing:</strong>{" "}
                      {pointData.projectionInfo.spacing}
                    </p>
                    <p>
                      <strong>Interpolation Method:</strong>{" "}
                      {pointData.projectionInfo.method}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3">
              <p className="text-sm italic">
                <strong>Note:</strong> Orthometric height is essential for
                engineering projects, as it accounts for the Earth's gravity
                field and provides a true elevation above mean sea level.
                Therefore, orthometric height must be used for land delineation,
                township surveys, or any other engineering/surveying activities.{" "}
                <span className="text-blue-600">Ellipsoidal height</span> must
                be used if it is needed for any special circumstance.
              </p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-300 print:divide-black">
              <div className="p-3 text-center">
                <p className="font-semibold mb-2">Point Monograph</p>
                <img
                  src={pointData.images[0]}
                  alt="Point Monograph"
                  className="mx-auto h-48 object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-semibold mb-2">Point picture</p>
                <img
                  src={pointData.images[1]}
                  alt="Point Picture"
                  className="mx-auto h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PointDetails;
