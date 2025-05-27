import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotel = () => {
  const { data: hotelData } = useQuery({
    queryKey: ["viewMyHotels"],
    queryFn: apiClient.viewHotel,
  });

  if (!hotelData) {
    return (
      <span className="text-center text-2xl md:text-4xl my-5">
        No Hotels Found
      </span>
    );
  }

  return hotelData && (
    <div className="space-y-5 mx-auto container my-3 md:my-5">
      <span className="flex justify-around">
        <h1 className="text-xl md:text-3xl font-bold mb-3">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-black text-white hover:text-gray-300 font-bold p-2 rounded-md text-xs md:text-xl items-center"
        >
          Add Hotel
        </Link>
      </span>

      <div className="grid grid-cols-1 m-10 md:m-6 gap-8">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            className="flex flex-col justify-baseline border border-slate-200 rounded-md p-8 gap-5 shadow-md hover:shadow-xl cursor-pointer"
          >
            <h2 className="font-bold text-xl">{hotel.name}</h2>
            <p className="text-md font-normal text-gray-800">
              {hotel.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-gray-600 text-center">
              <div className="border border-slate-300 p-3 rounded-sm flex items-center gap-1">
                <BsMap className="text-sm md:text-md"/>{hotel.city}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center gap-1">
               <BsBuilding className="text-sm md:text-md"/>{hotel.country}
              </div>
               <div className="border border-slate-300 rounded-sm p-3 flex items-center gap-1">
                <BiMoney className="text-5xl md:text-xl"/> ₹{hotel.pricePerNight} per night
              </div>
              <div className="border  border-slate-300 rounded-sm p-3 flex items-center gap-1">
                <BiHotel className="text-5xl md:text-xl"/> Adult: {hotel.adultCount} , Child: {hotel.childCount}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center gap-1">
                  Rating: {hotel.starRating} <span><BiStar size={12}/></span>
              </div>
            </div>
            <span className="flex justify-end">
              <Link to={`/edit-hotel/${hotel._id}`} className="flex bg-black text-white hover:text-gray-300 font-bold p-2 rounded-md text-xs md:text-xl items-center">View Details</Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotel;
