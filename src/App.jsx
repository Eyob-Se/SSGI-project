import React from "react";
import Navbar from "./component/Navbar.jsx";
import Hero from "./component/Hero.jsx";
import OLMap from "./component/OLMap.jsx";
const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <div
        style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
      >
        <OLMap />
      </div>
    </>
  );
};

export default App;
