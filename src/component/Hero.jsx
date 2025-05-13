import React from "react";
import OLMap from "./OLMap.jsx";
import { useState } from "react";
import { useEffect } from "react";

const Hero = () => {
  return (
    <>
      <section className="font-[poppins] min-h-screen grid grid-cols-2 pt-[7rem] ">
        <div className=" flex flex-col items-center mt-[8rem] space-y-2">
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
        <div>
          <OLMap />
        </div>
      </section>

      <section className="font-[poppins] px-8 py-16 bg-gray-50 text-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Key Characteristics of Geodetic Control Points
          </h2>
          <ul className="space-y-6 text-lg leading-relaxed">
            <li>
              <strong>1. Precise Coordinates:</strong>
              Each control point has accurately measured geographic coordinates
              — including <em>latitude</em>, <em>longitude</em>, and often{" "}
              <em>elevation</em>. These values are determined using
              high-precision GNSS or classical surveying techniques.
            </li>
            <li>
              <strong>2. High Accuracy and Reliability:</strong>
              These points serve as the foundation for all spatial data. They
              are known for sub-centimeter accuracy and undergo regular updates
              for quality assurance.
            </li>
            <li>
              <strong>3. Physical Markers:</strong>
              Geodetic points are often marked with durable materials like{" "}
              <em>metal disks</em>, <em>concrete pillars</em>, or{" "}
              <em>brass plates</em>, physically embedded in the ground.
            </li>
            <li>
              <strong>4. Hierarchical Classification:</strong>
              Points are categorized by precision:
              <ul className="list-disc list-inside ml-4">
                <li>
                  <strong>0-Order:</strong> National-level, ultra-high-precision
                  GNSS base stations.
                </li>
                <li>
                  <strong>1st/2nd-Order:</strong> Regional/local control points
                  for engineering and mapping.
                </li>
              </ul>
            </li>
            <li>
              <strong>5. Officially Maintained:</strong>
              Managed by national agencies or geospatial authorities to ensure
              consistency across all geographic and survey data.
            </li>
            <li>
              <strong>6. Foundation for Mapping & Surveying:</strong>
              These points enable accurate GIS data alignment, support
              infrastructure projects, and form the backbone of spatial analysis
              systems.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Hero;
