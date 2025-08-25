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
import UserDashboard from "./pages/userDashboard";
import Rawdatadashboard from "./pages/RawDataDashboard";
import { UserProvider } from "./context/UserContext";
import PrivateRoute from "./components/PrivateRoute";

// Import layout component
import Layout from "./components/Layout";
import StandardUsers from "./pages/standardUser";
import Payment from "./pages/PaymentUpload";
import PaymentVerification from "./pages/PaymentVerification";
import ProfilePage from "./pages/ProfilePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

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
              <Route
                path="/points/:pointId"
                element={
                  <PrivateRoute allowedRoles={["Standard"]}>
                    <PointDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="user-dashboard"
                element={
                  <PrivateRoute allowedRoles={["Standard"]}>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="upload-data"
                element={
                  <PrivateRoute allowedRoles={["dataAdmin"]}>
                    <DataUpload />
                  </PrivateRoute>
                }
              />
              <Route
                path="raw-data-view"
                element={
                  <PrivateRoute allowedRoles={["dataAdmin"]}>
                    <Rawdatadashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="standard-users"
                element={
                  <PrivateRoute allowedRoles={["requestAdmin"]}>
                    <StandardUsers />
                  </PrivateRoute>
                }
              />
              <Route
                path="payment-upload"
                element={
                  <PrivateRoute allowedRoles={["Standard"]}>
                    <Payment />
                  </PrivateRoute>
                }
              />
              <Route
                path="request-management"
                element={
                  <PrivateRoute allowedRoles={["requestAdmin"]}>
                    <RequestManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="payment-view"
                element={
                  <PrivateRoute allowedRoles={["requestAdmin"]}>
                    <PaymentVerification />
                  </PrivateRoute>
                }
              />

              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Route>
          </Routes>
        </AnimatePresence>
      </Router>
    </UserProvider>
  );
}

export default App;
