import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import AddHotel from "../pages/AddHotel";
import MyHotel from "../pages/MyHotel";
import EditHotel from "../pages/EditHotel";
import SearchBar from "./SearchBar";
import Search from "../pages/Search";
import HotelDetails from "../pages/HotelDetails";
import ProtectedRoute from "./ProtectedRoute";
import Booking from "../pages/Booking";
import MyBookings from "../pages/MyBookings";

const Body = () => {

  const AppLayout = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <SearchBar />
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
          element: <SignUp />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/detail/:hotelId",
          element: <HotelDetails />,
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/add-hotel",
              element: <AddHotel /> ,
            },
            {
              path: "/hotel/:hotelId/booking",
              element: <Booking /> ,
            },
            {
              path: "/my-hotels",
              element: <MyHotel /> ,
            },
            {
              path: "/my-bookings",
              element: <MyBookings /> ,
            },
            {
              path: "/edit-hotel/:hotelId",
              element: <EditHotel /> ,
            },
          ],
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
