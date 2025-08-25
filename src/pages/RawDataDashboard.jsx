import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import axios from "axios";

const RawDataDashboard = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Fetch file metadata (exclude `data` field for performance)
        const res = await axios.get("http://localhost:8000/api/rawdata/files", {
          withCredentials: true,
        });
        setFiles(res.data); // Expect array of {id, title, description, filename, mimetype, size_bytes, uploaded_at}
      } catch (error) {
        console.error("Failed to fetch raw data files:", error);
      }
    };

    fetchFiles();
  }, []);

  // Inside RawDataDashboard component

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/rawdata/files/${id}`, {
        withCredentials: true,
      });
      // Remove deleted file from UI
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file.");
    }
  };

  // Download handler: fetches the file blob from backend and triggers download
  const handleDownload = async (id, filename, mimetype) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/rawdata/files/${id}/download`,
        {
          responseType: "blob", // important for binary data
          withCredentials: true,
        }
      );

      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: mimetype })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-12 font-[Poppins]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Raw Data Files</h1>

      {files.length === 0 ? (
        <p className="text-gray-600">No raw data files found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <motion.div
              key={file.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col justify-between"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <FileText className="w-10 h-10 text-indigo-600" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {file.title}
                  </p>
                  <p className="text-sm text-gray-600">{file.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {file.size_bytes} bytes &bull;{" "}
                    {new Date(file.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-4 space-x-2">
                <button
                  onClick={() =>
                    handleDownload(file.id, file.filename, file.mimetype)
                  }
                  className="bg-indigo-900 text-white text-sm px-4 py-2 rounded hover:bg-indigo-900 transition w-full"
                >
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RawDataDashboard;
