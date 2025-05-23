import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../context/SearchContext";
import { useAppContext } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate("/sign-in", {state:{from:location}})
  };
  const handleOnSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate(`/hotel/${hotelId}/booking`)
  };

  return (
    <div className="flex flex-col p-4 bg-black gap-4">
      <h3 className="text-xl font-bold text-white">₹{pricePerNight}</h3>
      <form onSubmit={isLoggedIn?handleSubmit(handleOnSubmit) :handleSubmit(handleSignIn)}>
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-In Date"
              className="w-full bg-white p-2 rounded-lg font-semibold focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-Out Date"
              className="w-full text-gray-500 bg-white p-2 rounded-lg font-semibold focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div className="flex px-2 py-1 bg-white rounded-lg">
            <label className="text-gray-500 font-semibold items-center flex">
              Adults:
              <input
                type="number"
                className=" p-1 focus:outline-none font-semibold"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is Required",
                  min: {
                    value: 1,
                    message: "There must be atleast one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="text-gray-500 font-semibold items-center flex">
              Child:
              <input
                type="number"
                className=" p-1 focus:outline-none font-semibold"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-sm font-semibold text-red-600">
                {errors.adultCount.message}
              </span>
            )}
          </div>
          <button className="bg-white text-black font-bold p-2 h-full hover:text-gray-600 text-xl cursor-pointer">
            {isLoggedIn ? "Book Now" : "SignIn to Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
