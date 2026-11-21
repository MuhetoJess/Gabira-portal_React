import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ expectedRole, children }) {
  const { session } = useAuth();

  if (!session || session.role !== expectedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
