import { Link } from "react-router-dom";
import type { HotelType } from "../../../shared/types";

type Props = {
  hotel: HotelType;
};
const LatestHotelCard = ({ hotel }: Props) => {
  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-md"
    >
      <div className="h-[300px] ">
        <img
          src={hotel.imageUrls[0]}
          alt="hotel_image"
          loading="eager"
          className="w-full h-full  object-cover object-center"
        />
      </div>

      <div className="absolute bottom-0 p-4 bg-black opacity-70 w-full rounded-b-md">
        <span className="text-white font-bold tracking-tight text-3xl">
          {hotel.name}
        </span>
      </div>
    </Link>
  );
};

export default LatestHotelCard;
