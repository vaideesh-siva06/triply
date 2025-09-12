import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const loggedIn = useAuth();

  if (loggedIn) return <Navigate to="/" replace />; 
  return children;
};

export default PublicRoute;
