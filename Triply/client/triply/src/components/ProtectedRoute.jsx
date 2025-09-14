import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

const ProtectedRoute = ({ children, isAuthenticated, loading }) => {
  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
