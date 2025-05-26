import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import BookingForm from "../form/BookingForm";
import { useSearchContext } from "../context/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import Spinner from "../components/Spinner";

const Booking = () => {
  const search = useSearchContext();
  const { hotelId } = useParams();
  const [numberOfNight, setNumberofNight] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);
      setNumberofNight(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: hotel } = useQuery({
    queryKey: ["fetchhotelById"],
    queryFn: () => apiClient.fetchMyHotelsById(hotelId as string),
    enabled: !!hotelId,
  });
  const { data: userDetails } = useQuery({
    queryKey: ["getUserDetails"],
    queryFn: apiClient.getUserProfile,
  });

  if (!userDetails) {
    return (
      <div className="text-3xl font-bold text-center mt-10">
        <Spinner/>
      </div>
    );
  }
  if (!hotel) {
  return <div className="text-3xl font-bold text-center mt-10">
    <Spinner/></div>;
}


  return (
    userDetails && (
      <div className=" mt-5 grid md:grid-cols-[1fr_2fr] m-5 gap-4">
        <BookingDetailsSummary
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          adultCount={search.adultCount}
          childCount={search.childCount}
          numberOfNight={numberOfNight}
          hotel={hotel}
        />
        <BookingForm currentUser={userDetails} />
      </div>
    )
  );
};

export default Booking;
