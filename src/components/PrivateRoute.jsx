import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useUser();

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.usertype)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
