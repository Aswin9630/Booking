import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAppContext();
  if (isLoggedIn === undefined) {
    return <div className="text-3xl text-center p-2">Loading...</div>; 
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
