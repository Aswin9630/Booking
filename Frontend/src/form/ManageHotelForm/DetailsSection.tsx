import { useFormContext } from "react-hook-form";
import type { HotelformData } from "./ManageHotelForm";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelformData>();
  return (
    <div className="flex flex-col gap-4 my-5">
      <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
      <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
        Name
        <input
          className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
          type="text"
          {...register("name", {
            required: "Name is Required",
          })}
        />
        {errors.name && (
          <span className="text-red-600 text-sm font-normal">
            {errors.name.message}
          </span>
        )}
      </label>
      <div className="flex gap-4">
        <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
          City
          <input
            className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
            type="text"
            {...register("city", {
              required: "city is Required",
            })}
          />
          {errors.city && (
            <span className="text-red-600 text-sm font-normal">
              {errors.city.message}
            </span>
          )}
        </label>
        <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
          Country
          <input
            className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
            type="text"
            {...register("country", {
              required: "country is Required",
            })}
          />
          {errors.country && (
            <span className="text-red-600 text-sm font-normal">
              {errors.country.message}
            </span>
          )}
        </label>
      </div>
      <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
        Description
        <textarea
          rows={10}
          className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
          {...register("description", {
            required: "Description is Required",
          })}
        ></textarea>
        {errors.description && (
          <span className="text-red-600 text-sm font-normal">
            {errors.description.message}
          </span>
        )}
      </label>
      <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
        Price Per Night
        <input
          className="border rounded outline-none border-gray-500 max-w-[50%] font-normal px-2 py-1"
          min={1}
          type="number"
          {...register("pricePerNight", {
            required: "Price Per Night is Required",
          })}
        />
        {errors.pricePerNight && (
          <span className="text-red-600 text-sm font-normal">
            {errors.pricePerNight.message}
          </span>
        )}
      </label>
      <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
        Start Rating
        <select
          {...register("starRating", {
            required: "This field is required",
          })}
          className="border border-gray-500 rounded w-full p-2 text-gray-700 5ont-normal"
        >
          <option value="" className="text-sm font-bold">
            Select as Rating
          </option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-red-600 text-sm font-normal">
            {errors.starRating.message}
          </span>
        )}
      </label>
    </div>
  );
};

export default DetailsSection;
