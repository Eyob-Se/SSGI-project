// Import necessary dependencies from React and React Router
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Import all pages
import Home from "./pages/Home";
import About from "./pages/About";
import DataRequest from "./pages/DataRequest";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import PointDetails from "./pages/PointDetails";
import DataUpload from "./pages/DataUpload";
import RequestManagement from "./pages/RequestManagement";
import { UserProvider } from "./context/UserContext";
import PrivateRoute from "./components/PrivateRoute";

// Import layout component
import Layout from "./components/Layout";

/**
 * Main App component that sets up routing and layout structure
 * Uses React Router for navigation and Framer Motion for page transitions
 */
function App() {
  return (
    <UserProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Main layout wrapper that includes navbar and footer */}
            <Route path="/" element={<Layout />}>
              {/* Define all routes and their corresponding components */}
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="data-request" element={<DataRequest />} />
              <Route path="login" element={<Login />} />
              <Route
                path="users"
                element={
                  <PrivateRoute allowedRoles={["superAdmin"]}>
                    <UserManagement />
                  </PrivateRoute>
                }
              />
              <Route path="point-details/:id" element={<PointDetails />} />
              <Route
                path="data-upload"
                element={
                  <PrivateRoute allowedRoles={["dataAdmin"]}>
                    <DataUpload />
                  </PrivateRoute>
                }
              />
              <Route
                path="request-management"
                element={<RequestManagement />}
              />
            </Route>
          </Routes>
        </AnimatePresence>
      </Router>
    </UserProvider>
  );
}

export default App;
