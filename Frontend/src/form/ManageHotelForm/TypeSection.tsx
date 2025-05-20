import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import type { HotelformData } from "./ManageHotelForm";

const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelformData>();
  const typeWatch = watch("type");
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Type </h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 items-center text-center">
        {hotelTypes.map((type) => (
          <label key={type}
            className={
              typeWatch === type
                ? "cursor-pointer bg-gray-600  text-sm rounded-full px-4 py-2 font-semibold"
                : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold"
            }
          >
            <input
              type="radio"
              value={type}
              {...register("type", {
                required: "This field is required",
              })}
              className="hidden"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-600 text-sm font-normal">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default TypeSection;
