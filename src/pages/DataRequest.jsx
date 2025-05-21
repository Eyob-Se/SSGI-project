import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowRight } from "lucide-react";

const DataRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pointArea: "",
    purpose: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        pointArea: "",
        purpose: "",
        message: "",
      });

      // Reset success message after a delay
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
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
                  ></path>
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
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
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
                  name="email"
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
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="pointArea"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Point Area / Location *
                </label>
                <input
                  type="text"
                  id="pointArea"
                  name="pointArea"
                  value={formData.pointArea}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="Specify the area or region"
                />
              </div>

              <div>
                <label
                  htmlFor="purpose"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Purpose of Request *
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                >
                  <option value="">Select a purpose</option>
                  <option value="survey">Land Surveying</option>
                  <option value="construction">Construction</option>
                  <option value="research">Research</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="input-field w-full"
                  placeholder="Provide any additional details about your request"
                ></textarea>
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
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
