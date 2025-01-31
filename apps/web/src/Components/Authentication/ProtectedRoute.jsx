import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    console.log("Access denied - Redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}