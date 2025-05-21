import { useFormContext } from "react-hook-form";
import type { HotelformData } from "./ManageHotelForm";
import type React from "react";

const ImageSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelformData>();

  const existingImageUrls = watch("imageUrls");

  const handleDeleteImage = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border border-gray-400 rounded p-4 flex flex-col gap-4 cursor-pointer">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
              <div className="relative group">
                <img
                  src={url}
                  alt="images"
                  className="min-h-full object-cover"
                />
                <button onClick={(event)=>handleDeleteImage(event,url)} className="absolute inset-0 flex items-center justify-center bg-black group-hover:opacity-50 opacity-0 text-white text-xs cursor-pointer">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal cursor-pointer bg-gray-200 p-2 rounded-lg"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength = imageFiles.length + (existingImageUrls?.length || 0);

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
