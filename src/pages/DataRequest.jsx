import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import axios from "axios";

const DataRequest = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    pointId: "",
    reason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:8000/api/data-request", formData);

      setIsSubmitting(false);
      setIsSubmitted(true);

      setFormData({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        pointId: "",
        reason: "",
      });

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      setIsSubmitting(false);
      alert("Failed to submit the request. Please try again.");
      console.error(error);
    }
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
          <h1 className="text-3xl font-bold font-[poppins] text-gray-900 mb-4">
            Geodetic Control Points Request Form
          </h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to request access to geodetic control point
            data.
          </p>
        </motion.div>

        {isSubmitted ? (
          <motion.div
            className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-2">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">
              Request Submitted Successfully!
            </h3>
            <p className="text-green-600 mb-4">
              Thank you for your request. Our team will review it and get back
              to you shortly.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn btn-blue-900"
            >
              Submit Another Request
            </button>
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
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="fname"
                  name="fname" // attribute changed
                  value={formData.fname}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lname"
                  name="lname" // attribute changed
                  value={formData.lname}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email" // attribute changed
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone" // attribute changed
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="pointId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Point ID *
                </label>
                <input
                  type="text"
                  id="pointId"
                  name="pointId" // attribute changed
                  value={formData.pointId}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="Enter the geodetic control point ID"
                />
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason for Request *
                </label>
                <textarea
                  id="reason"
                  name="reason" // attribute changed
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="input-field w-full"
                  placeholder="Explain why you need this data"
                />
              </div>

              <div className="mt-2">
                <button
                  type="submit"
                  className="btn bg-blue-900 text-white w-full flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
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

export default DataRequest;
