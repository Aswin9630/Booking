import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SignOut from "./SignOut";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="py-6 shadow-lg shadow-neutral-200 ">
      <div className="flex justify-between px-2 md:px-7 mx-auto">
        <span className="text-sm md:text-xl font-serif font-bold md:font-extrabold">
          <Link to="/">NextStay.com</Link>
        </span>
        <span className="flex gap-1 md:gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className="py-2 px-1 md:px-6 md:py-2 text-xs md:text-md text-center rounded-md text-white hover:text-gray-300 font-semibold bg-black"
              >
                My Bookings
              </Link>
              <Link
                to="/my-hotels"
                className="py-2 px-1 md:px-6 md:py-2 text-xs md:text-md text-center rounded-md text-white hover:text-gray-300 font-semibold bg-black"
              >
                My Hotel
              </Link>
              <SignOut/>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="py-2 px-1 md:px-6 md:py-2 text-xs md:text-md text-center rounded-md text-white hover:text-gray-300 font-semibold bg-black"
            >
              SignIn
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
