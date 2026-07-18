import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role - redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRedirects = {
      student: '/student/dashboard',
      tpo: '/tpo/dashboard',
      company: '/company/dashboard',
      alumni: '/alumni/dashboard',
    };
    return <Navigate to={roleRedirects[user.role] || '/'} replace />;
  }

  // All checks passed - render the protected component
  return children;
};

export default ProtectedRoute;