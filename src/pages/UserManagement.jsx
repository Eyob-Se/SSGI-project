import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing

const API = "http://localhost:8000/api/users"; // <- change if needed

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    usertype: "Standard",
    isActive: true,
    password: "", // Add password to form data
  });

  /* ─────────── FETCH on mount ─────────── */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API, { credentials: "include" });
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchUsers();
  }, []);

  /* ─────────── SEARCH ─────────── */
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const filteredUsers = users.filter((u) =>
    `${u.fname} ${u.lname} ${u.email} ${u.usertype}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ─────────── FORM helpers ─────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      fname: "",
      lname: "",
      email: "",
      usertype: "Standard",
      isActive: true,
      password: "", // Reset password
    });
  };

  /* ─────────── MODAL actions ─────────── */
  const handleAddUser = () => {
    setCurrentUser(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditUser = (u) => {
    setCurrentUser(u);
    setFormData({
      fname: u.fname,
      lname: u.lname,
      email: u.email,
      usertype: u.usertype,
      isActive: u.isActive,
      password: "", // Do not pre-fill password for security reasons
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) setUsers((u) => u.filter((x) => x.id !== id));
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  /* ─────────── SUBMIT (add / edit) ─────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = currentUser ? "PUT" : "POST";
    const url = currentUser ? `${API}/${currentUser.id}` : API;

    // Hash password if provided
    if (formData.password) {
      const salt = bcrypt.genSaltSync(10);
      formData.password = bcrypt.hashSync(formData.password, salt);
    } else {
      delete formData.password; // Remove password if not provided
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const saved = await res.json();

      if (!res.ok) throw new Error(saved.error || "Save failed");

      setUsers(
        (prev) =>
          method === "POST"
            ? [...prev, saved]
            : prev.map((u) =>
                u.id === saved.id
                  ? { ...u, isActive: formData.isActive, ...saved }
                  : u
              ) // Ensure isActive is updated
      );
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };
  /* ─────────── UI (unchanged markup & classes) ─────────── */
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* header + add button (unchanged) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage users and their access to the system
          </p>
        </motion.div>
        <motion.div
          className="mt-4 md:mt-0 flex"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={handleAddUser}
            className="btn bg-blue-900 text-white flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New User
          </button>
        </motion.div>
      </div>

      {/* search bar + table (identical markup) */}
      {/* --- search bar --- */}
      <motion.div
        className="bg-white rounded-lg shadow-md mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10 w-full"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* --- table (only handlers changed) --- */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {/* headings unchanged */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.fname}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.lname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.usertype}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.id !== 1 && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* modal (same markup, submit wired) */}
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
                    {currentUser ? "Edit User" : "Add New User"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* --- form unchanged, handlers wired --- */}
                <form onSubmit={handleSubmit}>
                  {/* First name */}
                  <div className="mb-4">
                    <label
                      htmlFor="fname"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      id="fname"
                      name="fname"
                      value={formData.fname}
                      onChange={handleChange}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  {/* Last name */}
                  <div className="mb-4">
                    <label
                      htmlFor="lname"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      id="lname"
                      name="lname"
                      value={formData.lname}
                      onChange={handleChange}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  {/* email */}
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  {/* Password */}
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field w-full"
                      required={!currentUser} // Require password only when adding a new user
                    />
                  </div>
                  {/* usertype */}
                  <div className="mb-4">
                    <label
                      htmlFor="usertype"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      User Type
                    </label>
                    <select
                      id="usertype"
                      name="usertype"
                      value={formData.usertype}
                      onChange={handleChange}
                      className="input-field w-full"
                      required
                    >
                      <option value="dataAdmin">Data Admin</option>
                      <option value="Standard">Standard user</option>
                      <option value="requestAdmin">Request Admin</option>
                    </select>
                  </div>
                  {/* active */}
                  <div className="mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-800 focus:ring-primary-light border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isActive"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Active
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn bg-blue-900 text-white"
                    >
                      {currentUser ? "Update User" : "Add User"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagement;
