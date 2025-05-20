import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotel-options-config";
import type { HotelformData } from "./ManageHotelForm";

const FacilitySection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelformData>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-4 md:grid-cols-5 gap-5 md:gap-3">
        {hotelFacilities.map((facility) => (
          <label key={facility} className="text-xs md:text-sm flex gap-1 text-gray-700 items-center">
            <input
              type="checkbox"
              className="cursor-pointer"
              value={facility}
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "At least one facility is required";
                  }
                },
              })}
            />
            {facility}
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-600 font-normal text-sm">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitySection;
