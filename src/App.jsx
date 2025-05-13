import React from "react";
import Navbar from "./component/Navbar.jsx";
import Hero from "./component/Hero.jsx";

const App = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-100 to-orange-100">
        <Navbar />
        <Hero />
      </div>
    </>
  );
};

export default App;
