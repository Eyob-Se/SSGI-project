import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Printer, Download, ArrowLeft } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PointDetails = () => {
  const { pointId } = useParams();
  const [pointData, setPointData] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const element = document.querySelector("#point-detail-section");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Point-${pointData?.id || "details"}.pdf`);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  useEffect(() => {
    const fetchPointData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/points/${pointId}`
        );
        setPointData(res.data);
      } catch (err) {
        console.error("Failed to load point data:", err);
      }
    };

    fetchPointData();
  }, [pointId]);

  if (!pointData) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium">
        Loading point data...
      </div>
    );
  }

  const isFirstOrder = !!pointData.station_id;
  const isZeroOrder = !!pointData.location;

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-200 py-1">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-800">{value || "N/A"}</span>
    </div>
  );

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/user-dashboard"
          className="flex items-center text-blue-800 hover:text-blue-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="btn bg-indigo-800 text-white hover:bg-indigo-900 flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="btn bg-blue-600 text-white hover:bg-blue-800 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      <motion.div
        id="point-detail-section"
        className="bg-white rounded-lg shadow-md p-6 space-y-6 print:shadow-none"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Geodetic Control Point Description
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Data Source:{" "}
            <span className="font-medium">
              {isFirstOrder
                ? "First Order"
                : isZeroOrder
                ? "Zero Order"
                : "Unknown"}
            </span>
          </p>
        </div>

        {/* General Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            General Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="GCP ID" value={pointData.id} />
            <InfoRow label="Zone" value={pointData.zone} />
            <InfoRow label="Region" value={pointData.region} />
            {isZeroOrder && (
              <InfoRow label="Location" value={pointData.location} />
            )}
            {isFirstOrder && (
              <InfoRow label="Town Name" value={pointData.town_name} />
            )}
            {isFirstOrder && (
              <InfoRow label="Station ID" value={pointData.station_id} />
            )}
          </div>
        </div>

        {/* Coordinates */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Coordinate Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pointData.easting__w !== undefined && (
              <InfoRow label="Easting (W)" value={pointData.easting__w} />
            )}
            {pointData.norting__w !== undefined && (
              <InfoRow label="Northing (W)" value={pointData.norting__w} />
            )}
            {pointData.easting !== undefined && (
              <InfoRow label="Easting" value={pointData.easting} />
            )}
            {pointData.northing !== undefined && (
              <InfoRow label="Northing" value={pointData.northing} />
            )}
          </div>
        </div>

        {/* Additional Fields */}
        {(pointData.obsrvation || pointData.field9) && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Additional Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pointData.obsrvation && (
                <InfoRow label="Observation" value={pointData.obsrvation} />
              )}
              {pointData.field9 && (
                <InfoRow label="Field 9" value={pointData.field9} />
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PointDetails;
