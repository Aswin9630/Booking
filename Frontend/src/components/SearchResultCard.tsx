import { AiFillStar } from "react-icons/ai";
import type { HotelType } from "../../../Backend/src/model/hotelModel";
import { Link } from "react-router-dom";

type Props = {
  hotel: HotelType;
};

const SearchResultCard = ({ hotel }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] rounded-lg border border-slate-300 p-8 gap-8">
      <div className="w-full h-auto md:h-[300px] border border-slate-300 p-3 rounded-sm shadow-md">
        <img
          src={hotel.imageUrls[0]}
          alt="hotel-image"
          className="w-full h-full object-cover object-center rounded-lg"
        />
      </div>
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        <div>
          <div className="flex items-center">
            <span className="flex">
              {Array.from({ length: hotel.starRating }).map(() => (
                <AiFillStar  className="text-yellow-400" />
              ))}
            </span>
            <span className="ml-1 text-sm">{hotel.type}</span>
          </div>
          <Link to={`/detail/${hotel._id}`} className="text-xl md:text-2xl font-bold cursor-pointer">{hotel.name}</Link>
        </div>

        <div>
          <div className="line-clamp-4 text-sm md:text-lg">{hotel.description}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-end whitespace-nowrap gap-4">
          <div className="flex gap-1 items-center">
            {hotel.facilities.slice(0, 3).map((facility) => (
              <span key={facility} className="bg-slate-200 p-2 rounded-lg font-semibold text-xs whitespace-nowrap">
                {facility}
              </span>
            ))}
            <span className="text-sm">
              {hotel.facilities.length > 3 &&
                `+${hotel.facilities.length - 3} more`}
            </span>
          </div>
          <div className="flex flex-col md:items-end gap-1">
                <span className="font-bold">₹{hotel.pricePerNight} per night</span>
                <Link to={`/detail/${hotel._id}`} className="bg-black hover:text-gray-400 text-white h-full font-semibold p-2 max-w-fit rounded cursor-pointer">View More</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
