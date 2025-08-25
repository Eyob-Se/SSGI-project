import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  X,
  CreditCard,
  ReceiptText,
  BadgeCheck,
} from "lucide-react";
import axios from "axios";

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPoint, setNewPoint] = useState("");
  const [addedPoints, setAddedPoints] = useState([]);

  const [pendingPage, setPendingPage] = useState(1);
  const [verifiedPage, setVerifiedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/payment");
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };
    fetchPayments();
  }, []);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setShowModal(false);
  };

  const handleAddPoint = () => {
    if (newPoint.trim() && !addedPoints.includes(newPoint.trim())) {
      setAddedPoints([...addedPoints, newPoint.trim()]);
      setNewPoint("");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/payment/${id}/status`, {
        status,
        point_id: addedPoints, // ✅ Send point IDs
      });

      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );

      closeModal();
    } catch (err) {
      console.error(`Error updating status:`, err);
      alert("Failed to update status");
    }
  };

  const paginate = (arr, page) =>
    arr.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const section = (title, color, statusFilter, pageState, setPageState) => {
    const colorMap = {
      yellow: "border-yellow-500",
      green: "border-green-500",
      red: "border-red-500",
    };

    const filtered = payments.filter((p) => p.status === statusFilter);
    const paginated = paginate(filtered, pageState);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
      <div
        className={`bg-gray-100 p-6 mb-6 rounded-lg shadow-sm ${
          colorMap[color] || "border-gray-300"
        } border-l-4`}
      >
        <h2 className="text-xl font-semibold mb-3 capitalize">
          {title} Payments
        </h2>

        {filtered.length === 0 ? (
          <p className="text-gray-600 mt-2">No {title} payments found.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {paginated.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="text-indigo-600" />
                    <div className="flex flex-col text-sm text-gray-700 font-medium">
                      <span>
                        #{p.id} — {p.amount} ETB
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(p.created_at).toLocaleDateString()}{" "}
                        {new Date(p.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(p)}
                    className="text-white bg-indigo-800 hover:bg-indigo-700 transition px-4 py-1.5 rounded text-sm"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setPageState((prev) => Math.max(1, prev - 1))}
                disabled={pageState === 1}
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Prev
              </button>
              <span className="self-center text-sm font-medium">
                Page {pageState} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPageState((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={pageState === totalPages}
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-[Poppins]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <CreditCard className="text-indigo-900" />
        Payment Verification Dashboard
      </h1>

      {section("pending", "yellow", "pending", pendingPage, setPendingPage)}
      {section("verified", "green", "verified", verifiedPage, setVerifiedPage)}
      {section("rejected", "red", "rejected", rejectedPage, setRejectedPage)}

      {/* Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white rounded-lg max-w-md w-full shadow-xl p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-900" />
                Payment Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold">ID:</span> {selectedPayment.id}
              </p>
              <p>
                <span className="font-semibold">User ID:</span>{" "}
                {selectedPayment.user_id}
              </p>
              <p>
                <span className="font-semibold">Amount:</span>{" "}
                {selectedPayment.amount} ETB
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedPayment.status}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedPayment.created_at).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Uploaded File:</span>{" "}
                <a
                  href={`http://localhost:8000/api/payment/${selectedPayment.id}/file`}
                  download={`payment_${selectedPayment.id}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  Download The Receipt
                </a>
              </p>
            </div>

            {selectedPayment.status === "pending" && (
              <>
                <div className="mt-6 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Add Point ID
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newPoint}
                      onChange={(e) => setNewPoint(e.target.value)}
                      placeholder="Enter Point ID"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                    <button
                      onClick={handleAddPoint}
                      className="px-3 py-1.5 text-sm bg-indigo-700 text-white rounded hover:bg-indigo-600"
                    >
                      Add
                    </button>
                  </div>

                  {addedPoints.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      {addedPoints.map((point, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-gray-100 px-3 py-1.5 rounded"
                        >
                          <span>{point}</span>
                          <button
                            onClick={() =>
                              setAddedPoints(
                                addedPoints.filter((_, i) => i !== index)
                              )
                            }
                            className="text-red-600 text-xs hover:underline"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedPayment.id, "verified")
                    }
                    className="bg-indigo-900 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedPayment.id, "rejected")
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentVerification;
