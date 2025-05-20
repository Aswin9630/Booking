import { useFormContext } from "react-hook-form";
import type { HotelformData } from "./ManageHotelForm";

const ImageSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelformData>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border border-gray-400 rounded p-4 flex flex-col gap-4 cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal cursor-pointer bg-gray-200 p-2 rounded-lg"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength = imageFiles.length;

              if (totalLength === 0) {
                return "At least one image should be added";
              }
              if (totalLength > 6) {
                return "Total number of images cannot be more than 6";
              }

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-sm text-red-600 font-normal">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImageSection;
