import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Password reset email sent.");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error. Try again.");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

        {message && <div className="text-green-600 mb-4">{message}</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm text-gray-700">Email</label>
          <input
            type="email"
            className="input-field w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn bg-blue-900 text-white w-full mb-3"
          >
            Send Reset Link
          </button>
        </form>

        <button
          onClick={() => navigate("/login")} // Or navigate("/login") if preferred
          className="text-blue-700 hover:text-blue-900 text-sm underline block text-center mt-4"
        >
          ← Back to Login
        </button>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
