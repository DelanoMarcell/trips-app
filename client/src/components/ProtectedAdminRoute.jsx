import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';



const ProtectedRoute = ({ requiredRole }) => {

  const isAuthenticated = Cookies.get('role') !== undefined && Cookies.get('role') !== null;
  const userRole = Cookies.get('role');  




  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute