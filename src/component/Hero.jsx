import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const Hero = () => {
  return (
    <section className="font-[poppins] float-right mr-[10rem] mt-[5rem]">
      <div className=" flex flex-col items-center justify-center space-y-2">
        <h1 className="text-[2rem]">Available Data</h1>
        <div className="text-lg flex flex-col items-center justify-center">
          <h2 className="text-[1.3rem]">
            0 Order(Fundamental Geodetic Station)
          </h2>
          <p className="rounded-[1rem] bg-blue-900 px-10 py-10 text-white">
            Total points
          </p>
        </div>
        <div className="text-lg flex flex-col items-center justify-center">
          <h2 className="text-[1.3rem]">1 Order(high-accuracy points)</h2>
          <p className="rounded-[1rem] bg-blue-900 px-10 py-10 text-white">
            Total points
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
