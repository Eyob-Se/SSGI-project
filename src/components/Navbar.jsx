import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapIcon, Menu, X, User } from "lucide-react";
import ssgi from "../assets/ssgi1.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Data Request", path: "/data-request" },
  ];

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
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium border border-white/30 hover:bg-white/10 flex items-center ${
                  location.pathname === "/login" ? "bg-white/20" : ""
                }`}
              >
                <User className="w-4 h-4 mr-1" />
                Login
              </Link>
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
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
