import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Loading } from "./StatusMessage.jsx";

/**
 * Hides pages from visitors who are not logged in (or not admins).
 * This is only for a good user experience: the backend enforces the real security.
 */
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading label="Checking your session…" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role) {
    return (
      <div className="container page">
        <div className="status status--error" role="alert">
          <h1>Admins only</h1>
          <p>Your account does not have access to this page.</p>
          <Link className="btn btn--ghost" to="/">Back to home</Link>
        </div>
      </div>
    );
  }
  return children;
}
