import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function StaffRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.staff) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
