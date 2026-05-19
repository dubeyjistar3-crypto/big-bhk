import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) return <main className="route-loading" />;

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;
