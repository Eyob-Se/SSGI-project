import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { MapIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-orange-600 font-[poppins] text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <MapIcon className="h-8 w-8 mr-2" />
              <span className="text-xl font-semibold">CORS System</span>
            </Link>
            <p className="mt-2 text-sm text-gray-300">
              Ethiopia's Geodetic Control Points Information System
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Services
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    About Us
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/data-request"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    Data Request
                  </Link>
                </li> */}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Contact
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">Addis Ababa, Ethiopia</li>
                <li className="text-gray-300 text-sm">info@corsystem.gov.et</li>
                <li className="text-gray-300 text-sm">+251 11 1234567</li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} CORS System. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <FontAwesomeIcon icon={faFacebook} className="h-6 w-6" />
            </a>
            <a
              href="https://l.facebook.com/l.php?u=https%3A%2F%2Fx.com%2Fessgi2022&h=AT1V1jAXd8bBUNEKvGwucceaQC3ePeG22jNBlJJCscYfbtud4Ku_-ovBb-3IZUKVg1k8easGdTmnC5uPwDgXdG4vAR9AGTthk9IcmaMuUmJIej19mbYfkt3TBuNRFBlkWyno5h3mPvDP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
            </a>
            <a
              href="https://l.facebook.com/l.php?u=https%3A%2F%2Flinkedin.com%2Fin%2Fssgi-37b48623a&h=AT0tmDdWz_1SCdOBxzWUsmZY0CBzOi2joJjZEAwK7ck3hJnSocL07DqXjIBLxEtExkPUsqUXMDL0M-H3cxybRZrIQcMVR3JjjrO8EO2gy2cZsvKFYO8QYqKe-O_mVg-f0NI6a_ELjE0L"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
