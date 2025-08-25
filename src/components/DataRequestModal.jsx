import React, { useState } from "react";
import axios from "axios";

const DataRequestModal = ({ show, onClose, pointId }) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
  });
  const [pdfLetter, setPdfLetter] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfLetter(file);
    } else {
      alert("Please upload a valid PDF letter.");
      setPdfLetter(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submission = new FormData();
    submission.append("pointId", pointId);
    submission.append("fname", formData.fname);
    submission.append("lname", formData.lname);
    submission.append("email", formData.email);
    submission.append("phone", formData.phone);
    if (pdfLetter) {
      submission.append("letter", pdfLetter); // key = 'letter'
    } else {
      alert("Please upload a PDF letter before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/data-request", submission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowSuccess(true);
      onClose();
      setFormData({ fname: "", lname: "", email: "", phone: "" });
      setPdfLetter(null);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request.");
    }
  };

  return (
    <>
      {/* Success popup */}
      {showSuccess && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          ✅ Request Submitted!
        </div>
      )}

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-3 text-gray-500 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Request Data</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm">Point ID</label>
                <input
                  type="text"
                  value={pointId}
                  disabled
                  className="w-full px-3 py-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm">First name</label>
                <input
                  name="fname"
                  placeholder="Enter your first name"
                  required
                  className="w-full px-3 py-2 border rounded"
                  value={formData.fname}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm">Last name</label>
                <input
                  name="lname"
                  placeholder="Enter your last name"
                  required
                  className="w-full px-3 py-2 border rounded"
                  value={formData.lname}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 border rounded"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm">Phone</label>
                <input
                  name="phone"
                  placeholder="Enter your phone number"
                  type="tel"
                  required
                  className="w-full px-3 py-2 border rounded"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm">Upload Letter (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-900 text-white py-2 rounded hover:bg-blue-900"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DataRequestModal;
