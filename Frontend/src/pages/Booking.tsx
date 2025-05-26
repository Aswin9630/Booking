import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import BookingForm from "../form/BookingForm";
import { useSearchContext } from "../context/SearchContext";
import { useParams } from "react-router-dom";
import {  useMemo } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import Spinner from "../components/Spinner";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../context/AppContext";

const Booking = () => {
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { hotelId } = useParams();

  const numberOfNight = useMemo(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);
      return Math.ceil(nights);
    }
    return 0;
  }, [search.checkIn, search.checkOut]);

  const { data: paymentIntentData, isLoading: isPaymentLoading } = useQuery({
    queryKey: ["createPaymentIntent", hotelId,numberOfNight],
    queryFn: () =>
      apiClient.createPaymentIntent(
        hotelId as string,
        numberOfNight.toString()
      ),
    enabled: !!hotelId && numberOfNight > 0,
  });
  
  const { data: hotel ,  isLoading: isHotelLoading} = useQuery({
    queryKey: ["fetchhotelById"],
    queryFn: () => apiClient.fetchMyHotelsById(hotelId as string),
    enabled: !!hotelId,
  });

  const { data: userDetails,  isLoading: isUserLoading  } = useQuery({
    queryKey: ["getUserDetails"],
    queryFn: apiClient.getUserProfile,
  });

    if (isUserLoading || isHotelLoading || isPaymentLoading) {
    return (
      <div className="text-3xl font-bold text-center mt-10">
        <Spinner />
      </div>
    );
  }

  return (
      <div className="mt-5 grid md:grid-cols-[1fr_2fr] m-5 md:m-7 lg:m-10 gap-4">
        <BookingDetailsSummary
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          adultCount={search.adultCount}
          childCount={search.childCount}
          numberOfNight={numberOfNight}
          hotel={hotel}
        />
        {userDetails && paymentIntentData?.clientSecret && stripePromise && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: paymentIntentData.clientSecret }}
          >
            <BookingForm currentUser={userDetails} paymentIntent={paymentIntentData}/>
          </Elements>
        )}
      </div>
    )
};

export default Booking;
