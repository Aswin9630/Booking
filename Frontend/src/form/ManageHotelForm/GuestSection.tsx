import { useFormContext } from "react-hook-form";
import type { HotelformData } from "./ManageHotelForm";

const GuestSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelformData>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="grid grid-cols-2 p-6 gap-5 bg-gray-200 rounded-lg">
        <label className="text-gray-700 text-sm font-semibold">
          Adults
          <input
            type="number"
            min={1}
            className="border border-gray-500 rounded w-full py-2 px-3 font-normal outline-none"
            {...register("adultCount", {
              required: "This field is required",
            })}
          />
          {errors.adultCount && (
            <span className="text-sm text-red-600 font-normal">
              {errors.adultCount.message} 
            </span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-semibold">
          Childrens
          <input
            type="number"
            min={0}
            className="border border-gray-500 rounded w-full py-2 px-3 font-normal outline-none"
            {...register("childCount", {
              required: "This field is required",
            })}
          />
          {errors.childCount && (
            <span className="text-sm text-red-600 font-normal">
              {errors.childCount.message} 
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default GuestSection;
