import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Spinner from "./Spinner";

const ProtectedRoute = () => {
  const { isLoggedIn,authLoading } = useAppContext();

  if (authLoading) {
    return <div className="text-3xl text-center p-2"><Spinner/></div>; 
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
