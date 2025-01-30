import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    console.log("access denied")
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}