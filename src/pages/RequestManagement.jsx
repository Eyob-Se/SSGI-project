import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, X } from "lucide-react";

const RequestManagement = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      userName: "John Doe",
      email: "john@example.com",
      requestDetails: "Request for account creation.",
    },
    {
      id: 2,
      userName: "Jane Smith",
      email: "jane@example.com",
      requestDetails: "Request for password reset.",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [paymentTransactions, setPaymentTransactions] = useState([
    { id: 1, amount: "$100", status: "Completed" },
    { id: 2, amount: "$50", status: "Pending" },
  ]);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");

  const handleViewRequest = (request) => {
    setCurrentRequest(request);
    setShowModal(true);
  };

  const handleCreateAccount = () => {
    // Logic to create an account would go here
    const generatedPassword = "temporaryPassword123"; // Example password generation
    setAccountEmail(currentRequest.email);
    setAccountPassword(generatedPassword);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRequest(null);
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Request Management
      </h1>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
        <h2 className="font-bold">Pending Requests</h2>
        <ul>
          {requests.map((request) => (
            <li key={request.id} className="flex justify-between items-center">
              <span>
                {request.userName}: {request.requestDetails}
              </span>
              <button
                onClick={() => handleViewRequest(request)}
                className="text-blue-600 hover:underline"
              >
                <Eye className="inline-block w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-bold mb-4">Payment Transactions</h2>
        <ul>
          {paymentTransactions.map((transaction) => (
            <li
              key={transaction.id}
              className="flex justify-between items-center"
            >
              <span>
                {transaction.amount} - {transaction.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Request Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="fixed inset-0 transition-opacity pointer-events-none">
              <div className="absolute inset-0 bg-gray-500 opacity-10"></div>
            </div>

            <motion.div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Request Details
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="mb-4">User: {currentRequest?.userName}</p>
                <p className="mb-4">Email: {currentRequest?.email}</p>
                <p className="mb-4">
                  Details: {currentRequest?.requestDetails}
                </p>

                <button
                  onClick={handleCreateAccount}
                  className="btn bg-blue-900 text-white mb-4"
                >
                  Create Account
                </button>

                {accountEmail && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Account created! Email: {accountEmail}, Password:{" "}
                      {accountPassword}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RequestManagement;
