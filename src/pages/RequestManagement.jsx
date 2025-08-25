import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [createdRequests, setCreatedRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [price, setPrice] = useState("");

  const [pendingPage, setPendingPage] = useState(1);
  const [createdPage, setCreatedPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/data-request");
        const pending = res.data.filter((req) => req.status === "pending");
        const created = res.data.filter((req) => req.status === "created");
        setRequests(pending);
        setCreatedRequests(created);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, []);

  const paginate = (array, page) =>
    array.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleViewRequest = (request) => {
    setCurrentRequest(request);
    setShowModal(true);
  };

  const handleCreateAccount = async () => {
    try {
      const password =
        `${currentRequest.fname.slice(0, 3)}` +
        `${currentRequest.lname.slice(0, 3)}` +
        `${currentRequest.email.slice(0, 3)}` +
        `${currentRequest.phone.slice(0, 4)}`;

      const fname = currentRequest.fname.split(" ")[0] || "FirstName";
      const lnameSplit = currentRequest.lname.split(" ");
      const lname =
        lnameSplit.length > 1 ? lnameSplit[1] : lnameSplit[0] || "LastName";

      const userPayload = {
        fname,
        lname,
        email: currentRequest.email,
        phone: currentRequest.phone,
        password,
        usertype: "Standard",
        isActive: true,
        dataRequestId: currentRequest.id,
      };

      // Add price validation here
      if (!price || isNaN(price)) {
        alert("Please enter a valid price before creating the account.");
        return;
      }

      const userRes = await axios.post(
        "http://localhost:8000/api/users",
        userPayload
      );

      if (userRes.status !== 201 && userRes.status !== 200) {
        throw new Error("User creation failed");
      }

      // Include the price in the email
      await axios.post("http://localhost:8000/api/send-email", {
        email: currentRequest.email,
        subject: "Your New Account Details and Payment Information",
        message: `Hello ${fname},\n\nYour account has been successfully created.\n\nEmail: ${currentRequest.email}\nPassword: ${password}\n\nPrice to Pay: ETB ${price}\n\nPlease log in and change your password for security.\n\nThank you!`,
      });

      setAccountEmail(currentRequest.email);
      setAccountPassword(password);

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000);

      setRequests((prev) => prev.filter((req) => req.id !== currentRequest.id));
      setCreatedRequests((prev) => [
        ...prev,
        { ...currentRequest, status: "created" },
      ]);
      handleCloseModal();
    } catch (error) {
      console.error("Detailed account creation error:", error);
      alert("Failed to create the account. Please try again.");
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRequest(null);
    setAccountEmail("");
    setAccountPassword("");
    setPrice(""); // Reset price
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-[Poppins]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showSuccessMessage && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-900 px-6 py-3 rounded-md shadow-md z-50"
        >
          ✅ Account created and email sent successfully!
        </motion.div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Request Management
      </h1>

      {/* Pending Requests */}
      <div className="bg-gray-100 border-l-4 border-yellow-500 text-black p-6 mb-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Pending Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600 mt-2">No pending requests found.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {paginate(requests, pendingPage).map((request) => (
                <li
                  key={request.id}
                  className="flex justify-between items-center bg-gray-200 p-4 rounded-lg border shadow-sm hover:shadow-md transition duration-200"
                >
                  <span className="text-sm text-gray-700">
                    <span className="font-bold">
                      {request.fname} {request.lname}
                    </span>
                    : {request.reason}
                  </span>
                  <button
                    onClick={() => handleViewRequest(request)}
                    className="text-white bg-indigo-900 hover:bg-indigo-700 transition duration-300 ease-in px-5 py-2 rounded-md text-sm font-medium"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
            {/* Pagination controls */}
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={pendingPage === 1}
              >
                Prev
              </button>
              <span className="text-sm font-medium self-center">
                Page {pendingPage} of{" "}
                {Math.ceil(requests.length / itemsPerPage)}
              </span>
              <button
                onClick={() =>
                  setPendingPage((p) =>
                    Math.min(Math.ceil(requests.length / itemsPerPage), p + 1)
                  )
                }
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={
                  pendingPage === Math.ceil(requests.length / itemsPerPage)
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Created Requests */}
      <div className="bg-gray-100 border-l-4 border-green-500 text-black p-6 mb-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Created Requests</h2>
        {createdRequests.length === 0 ? (
          <p className="text-gray-600 mt-2">No created requests found.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {paginate(createdRequests, createdPage).map((request) => (
                <li
                  key={request.id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition duration-200"
                >
                  <span className="text-sm text-gray-700">
                    <span className="font-bold">
                      {request.fname} {request.lname}
                    </span>
                    : {request.reason}
                  </span>
                  <span className="text-green-600 font-medium">Created</span>
                </li>
              ))}
            </ul>
            {/* Pagination controls */}
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setCreatedPage((p) => Math.max(1, p - 1))}
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={createdPage === 1}
              >
                Prev
              </button>
              <span className="text-sm font-medium self-center">
                Page {createdPage} of{" "}
                {Math.ceil(createdRequests.length / itemsPerPage)}
              </span>
              <button
                onClick={() =>
                  setCreatedPage((p) =>
                    Math.min(
                      Math.ceil(createdRequests.length / itemsPerPage),
                      p + 1
                    )
                  )
                }
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={
                  createdPage ===
                  Math.ceil(createdRequests.length / itemsPerPage)
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
          <motion.div
            className="bg-white rounded-lg max-w-lg w-full shadow-lg transform transition-all p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Request Details
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <span className="font-bold">First name:</span>{" "}
                {currentRequest?.fname}
              </p>
              <p>
                <span className="font-bold">Last name:</span>{" "}
                {currentRequest?.lname}
              </p>
              <p>
                <span className="font-bold">Email:</span>{" "}
                {currentRequest?.email}
              </p>
              <p>
                <span className="font-bold">Phone:</span>{" "}
                {currentRequest?.phone}
              </p>
              <p>
                <span className="font-bold">Point ID:</span>{" "}
                {currentRequest?.point_id}
              </p>
              <p>
                <span className="font-bold">Reason:</span>{" "}
                {currentRequest?.reason}
              </p>
              <button
                onClick={() =>
                  window.open(
                    `http://localhost:8000/api/data-request/${currentRequest.id}/letter`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="mt-2 px-3 py-1 text-sm bg-indigo-900 text-white rounded hover:bg-blue-700 transition"
              >
                View Letter PDF
              </button>
            </div>

            <label className="block mt-4">
              <span className="font-bold text-gray-700">Price (ETB):</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="block w-full mt-2 px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>

            <button
              onClick={handleCreateAccount}
              className="w-full bg-indigo-900 text-white py-3 mt-6 rounded-md shadow hover:bg-indigo-700 transition duration-300"
            >
              Create Account
            </button>

            {accountEmail && (
              <div className="mt-4 p-4 bg-green-100 rounded-md text-green-800 text-sm border border-green-300">
                <p className="font-semibold text-green-900">
                  Account created and email sent!
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href={`mailto:${accountEmail}`}
                    className="text-blue-700 underline hover:text-blue-900"
                  >
                    {accountEmail}
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Password:</span>{" "}
                  {accountPassword}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default RequestManagement;
