import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Check, FileText } from 'lucide-react';

const DataUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      previewFile(selectedFile);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFilePreview({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      });
    };
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      previewFile(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
        });
        setFile(null);
        setFilePreview(null);
        setUploadSuccess(false);
      }, 3000);
    }, 2000);
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Geodetic Control Points Raw Data Upload
          </h1>
          <p className="text-lg text-gray-600">
            Upload geodetic control point data for processing and integration into the system.
          </p>
        </motion.div>

        {uploadSuccess ? (
          <motion.div 
            className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-2">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">Upload Successful!</h3>
            <p className="text-green-600 mb-4">
              Your geodetic control point data has been uploaded successfully and is now being processed.
            </p>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="Enter a title for this data set"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="input-field w-full"
                  placeholder="Provide a brief description of the data"
                ></textarea>
              </div>
              
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Upload *
                </label>
                <div 
                  className={`border-2 border-dashed rounded-md p-6 text-center ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {filePreview ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-primary mr-3" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{filePreview.name}</p>
                          <p className="text-xs text-gray-500">{filePreview.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Drag and drop your file here, or
                          <label htmlFor="file-upload" className="ml-1 text-primary hover:text-primary-dark font-medium cursor-pointer">
                            browse
                          </label>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supported formats: CSV, TXT, XLS, XLSX, ZIP (max 25MB)
                        </p>
                      </div>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".csv,.txt,.xls,.xlsx,.zip"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full flex items-center justify-center"
                  disabled={isUploading || !file}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
};

export default DataUpload;