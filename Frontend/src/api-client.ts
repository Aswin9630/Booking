import type { SignInFormData } from "./components/SignIn";
import type { RegisterFormData } from "./components/SignUp";
import type { HotelType } from "../../Backend/src/model/hotelModel";
import type {
  HotelSearchResponse,
  PaymentIntentResponse,
  UserType,
} from "../../Backend/src/shared/types";
import type { BookingFormData } from "./form/BookingForm";
const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export const registerAPI = async (FormData: RegisterFormData) => {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(FormData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signInAPI = async (FormData: SignInFormData) => {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(FormData),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

export const getUserProfile = async (): Promise<UserType> => {
  const response = await fetch(`${BACKEND_URL}/auth/profile`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user details");
  }
  const responseBody = await response.json();
  return responseBody;
};

export const SignOutAPI = async () => {
  const response = await fetch(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
};

export const validateToken = async () => {
  const response = await fetch(`${BACKEND_URL}/auth/verifyToken`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token Invalid");
  }

  return response.json();
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${BACKEND_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });
  if (!response.ok) {
    throw new Error("Fail to add Hotel");
  }
  return response.json();
};

export async function viewHotel(): Promise<HotelType[]> {
  const response = await fetch(`${BACKEND_URL}/api/my-hotels`, {
    credentials: "include",
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
}

export const fetchMyHotelsById = async (
  hotelId: string
): Promise<HotelType> => {
  const response = await fetch(`${BACKEND_URL}/api/my-hotels/${hotelId}`, {
    method: "GET",
    credentials: "include",
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(
    `${BACKEND_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      body: hotelFormData,
      credentials: "include",
    }
  );
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("Failed to Update Hotel");
  }

  return responseBody;
};

type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOptions?: string;
};

export const searchhotels = async (
  searchParams: SearchParams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");
  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOptions", searchParams.sortOptions || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );
  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${BACKEND_URL}/api/hotels/search?${queryParams}`
  );
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return responseBody.response;
};

export const fetchhotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${BACKEND_URL}/api/hotels/${hotelId}`);
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("Error fetching hotel details");
  }

  return responseBody;
};

export const createPaymentIntent = async (
  hotelId: string,
  numberOfNight: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${BACKEND_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfNight }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Error creating payment intent");
  }
  const responseBody = await response.json();
  return responseBody;
};

export const createRoombooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${BACKEND_URL}/api/hotels/${formData.hotelId}/bookings`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message || "Room Booking Failed");
  }

  return responseBody;
};

export const fetchMyBookings = async():Promise<HotelType[]>=>{
  const response = await fetch(`${BACKEND_URL}/api/my-bookings`, {
    credentials:"include"
  })
  const responseBody = await response.json();
  if(!response.ok){
    throw new Error(responseBody.message)
  }

  return responseBody;
}
