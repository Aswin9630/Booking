import { useForm } from "react-hook-form";
import type {
  PaymentIntentResponse,
  UserType,
} from "../../../shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../context/SearchContext";
import * as apiClient from "../api-client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const search = useSearchContext();
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { mutate: bookRoom, isPending } = useMutation({
    mutationFn: apiClient.createRoombooking,
    onSuccess: () => {
      showToast({ message: "Booking Saved!", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error) => {
      showToast({ message:error.message || "Error saving booking", type: "FAILURE" });
    },
  });

  const { register, handleSubmit } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const onSubmit = async (FormData: BookingFormData) => {
    if (!stripe || !elements) {
      return;
    }
    const result = await stripe?.confirmCardPayment(
      paymentIntent.clientSecret,
      {
        payment_method: {
          card: elements?.getElement(CardElement) as StripeCardElement,
        },
      }
    );

    if (result.paymentIntent?.status === "succeeded") {
      bookRoom({ ...FormData, paymentIntentId: result.paymentIntent.id });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-xl md:text-3xl text-center font-bold">
        Confirm Your Details
      </span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border border-gray-400 rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border border-gray-400 rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border border-gray-400 rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl text-center md:text-2xl font-bold">
          Your Price Summary
        </h2>

        <div className="bg-gray-200 p-4 rounded">
          <div className="font-semibold text-lg">
            Total Cost: ₹{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes & charges</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded p-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isPending}
          type="submit"
          className="bg-black text-white font-semibold p-2 hover:text-gray-400 rounded text-md disabled:bg-gray-500 cursor-pointer"
        >
          {isPending ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
