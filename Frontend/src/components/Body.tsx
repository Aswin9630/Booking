import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import SignIn from "./SignIn";
import SIgnUp from "./SignUp";
import { useAppContext } from "../context/AppContext";
import AddHotel from "../pages/AddHotel";

const Body = () => {
  const { isLoggedIn } = useAppContext();

  const AppLayout = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    );
  };

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/sign-in",
          element: <SignIn />,
        },
        {
          path: "/sign-up",
          element: <SIgnUp />,
        },
        isLoggedIn && {
          path:'/add-hotel',
          element:<AddHotel/>
        },
      ].filter(Boolean) as any,
    },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
