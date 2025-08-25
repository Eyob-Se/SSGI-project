import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import ssgi from "../assets/ssgi1.png";
import { useUser } from "../context/UserContext"; // import the context

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    // Close dropdown whenever login status or user info changes
    setShowDropdown(false);
  }, [user]);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  // Dynamic links based on usertype
  let navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    // { name: "Data Request", path: "/data-request" },
  ];

  if (user.isLoggedIn && user.usertype === "superAdmin") {
    navLinks = [{ name: "Dashboard", path: "/users" }];
  } else if (user.isLoggedIn && user.usertype === "dataAdmin") {
    navLinks = [
      { name: "Dashboard", path: "/upload-data" },
      { name: "Raw Data", path: "/raw-data-view" },
    ];
  } else if (user.isLoggedIn && user.usertype === "requestAdmin") {
    navLinks = [
      {
        name: "Dashboard",
        path: "/request-management",
      },
      {
        name: "Users",
        path: "/standard-users",
      },
      {
        name: "Payment",
        path: "/payment-view",
      },
    ];
  } else if (user.isLoggedIn && user.usertype === "Standard") {
    navLinks = [
      { name: "Dashboard", path: "/user-dashboard" },
      { name: "Payment", path: "/payment-upload" },
    ];
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include", // send cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json().catch(() => ({})); // catch JSON error

      if (response.ok) {
        console.log("Logout success:", result);
        logout();
        setIsOpen(false);
        navigate("/login");
      } else {
        console.error("Logout failed:", result?.message || response.statusText);
        alert("Logout failed: " + (result?.message || response.statusText));
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout error: " + error.message);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-l from-indigo-900 to-orange-600 text-white font-[poppins]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-[5rem] w-auto" src={ssgi} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium relative ${
                    location.pathname === link.path
                      ? "text-white"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-accent w-full"
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
              ))}
            </div>
            <div className="ml-6">
              {user.isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium border border-white/30 hover:bg-white/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.fname || "profile"}
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
                      <Link
                        to="profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setShowDropdown(false);
                          setIsOpen(false);
                        }}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium border border-white/30 hover:bg-white/10 flex items-center ${
                    location.pathname === "/login" ? "bg-white/20" : ""
                  }`}
                >
                  <User className="w-4 h-4 mr-1" />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-800 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-blue-900"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? "bg-blue-800 text-white"
                    : "text-gray-200 hover:bg-blue-800 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user.isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-200 hover:bg-blue-800 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === "/login"
                    ? "bg-blue-800 text-white"
                    : "text-gray-200 hover:bg-blue-800 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
