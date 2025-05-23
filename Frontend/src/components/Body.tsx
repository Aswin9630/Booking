import { createBrowserRouter, Outlet, RouterProvider, type RouteObject } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useAppContext } from "../context/AppContext";
import AddHotel from "../pages/AddHotel";
import MyHotel from "../pages/MyHotel";
import EditHotel from "../pages/EditHotel";
import SearchBar from "./SearchBar";
import Search from "../pages/Search";
import HotelDetails from "../pages/HotelDetails";

const Body = () => {
  const { isLoggedIn } = useAppContext();

  const AppLayout = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <SearchBar/>
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
          path:'/add-hotel',
          element: isLoggedIn ? <AddHotel/> : <SignIn/>
        },
        {
          path:'/my-hotels',
          element: isLoggedIn ? <MyHotel/> :<SignIn/>
        },
        {
          path:'/edit-hotel/:hotelId',
          element: isLoggedIn ? <EditHotel /> :<SignIn/>
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
