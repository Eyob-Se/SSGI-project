import React from "react";
import ssgi from "../assets/images/ssgi.png";

const Navbar = () => {
  return (
    <>
      <nav>
        <div className="container mx-[10rem] my-[0rem] flex justify-between items-center pt-[2rem] ">
          <img className="h-[4.5rem] w-auto" src={ssgi} alt="" srcset="" />
          <ul className="flex font-[poppins] space-x-10 py-2 px-20 text-[1.2rem] ">
            <li>
              <a href="#" className="text-blue-900 hover:text-orange-500">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-900 hover:text-orange-500">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-900 hover:text-orange-500">
                Data request
              </a>
            </li>
          </ul>
          <button className="bg-blue-900 text-white py-2 px-5 rounded-[2rem] hover:text-orange-500 cursor-pointer">
            Login
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
