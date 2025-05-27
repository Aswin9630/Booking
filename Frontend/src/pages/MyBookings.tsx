import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
  const { data: hotels } = useQuery({
    queryKey: ["fetchMyBookings"],
    queryFn: apiClient.fetchMyBookings,
  });

  if (!hotels || hotels.length === 0) {
    return (
      <span className="text-3xl font-bold text-center mt-10">
        No bookings Found
      </span>
    );
  }
  return (
    <div className="mt-10 container mx-auto rounded-lg flex flex-col">
      <h1 className="text-center text-3xl font-bold mt-2">My Bookings</h1>
      {hotels.map((hotel) => (
        <div
          key={hotel._id}
          className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border border-slate-200 shadow-lg rounded p-8 m-5 gap-5 mx-auto container"
        >
          <div className="md:w-full md:h-[250px]">
            <img
              src={hotel.imageUrls[0]}
              className="w-full h-full object-cover object-center"
              alt="hotel_images"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {hotel.name}
              <div className="text-sm font-normal">
                {hotel.city}, {hotel.country}
              </div>
            </div>
            {hotel.bookings.map((booking) => (
              <div key={booking._id}>
                <div>
                  <span className="font-bold mr-2">Dates:</span>
                  <span className="text-gray-700">
                    {new Date(booking.checkIn).toDateString()} -
                    {new Date(booking.checkOut).toDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-bold mr-2">Guests:</span>
                  <span className="text-gray-700">
                    {booking.adultCount} Adult{booking.childCount > 0 && `, ${booking.childCount} Children`} 
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
