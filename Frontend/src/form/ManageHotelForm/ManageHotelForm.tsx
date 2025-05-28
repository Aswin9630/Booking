import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitySection from "./FacilitySection";
import GuestSection from "./GuestSection";
import ImageSection from "./ImageSection";
import type { HotelType } from "../../../../Backend/src/model/hotelModel";
import { useEffect } from "react";

export type HotelformData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls:string[]
  adultCount: number;
  childCount: number;
};

type Props = {
  hotel?:HotelType;
  onSave:(HotelformData:FormData)=>void;
  isLoading:boolean;
}

const ManageHotelForm = ({onSave,isLoading, hotel} : Props) => {
  const formMethods = useForm<HotelformData>();

  const { handleSubmit, reset } = formMethods;

  useEffect(()=>{
    reset(hotel)
  },[hotel,reset])

  const onSubmit = handleSubmit((formDatajson: HotelformData) => {
    const formData = new FormData();
    if(hotel?._id){
      formData.append("hotelId", hotel._id)
    }
    formData.append("name", formDatajson.name);
    formData.append("city", formDatajson.city);
    formData.append("country", formDatajson.country);
    formData.append("description", formDatajson.description);
    formData.append("type", formDatajson.type);
    formData.append("pricePerNight", formDatajson.pricePerNight.toString());
    formData.append("starRating", formDatajson.starRating.toString());
    formData.append("adultCount", formDatajson.adultCount.toString());
    formData.append("childCount", formDatajson.childCount.toString());

    formDatajson.facilities.forEach((facility,index)=>{
      formData.append(`facilities[${index}]`,facility)
    })

    if(formDatajson.imageUrls){
      formDatajson.imageUrls.forEach((url,index)=>{
        formData.append(`imageUrls[${index}]`, url);
      })
    }

    Array.from(formDatajson.imageFiles).forEach((imageFile)=>{
      formData.append('imageFiles',imageFile);
    })

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-7 container p-5 md:mx-auto" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitySection />
        <GuestSection />
        <ImageSection />
        <span className="flex justify-end">
          <button
          disabled={isLoading}
            type="submit"
            className="py-2 mb-3 px-2 md:px-6 text-xs md:text-md text-center rounded-2xl md:rounded-full text-white hover:text-gray-300 font-semibold bg-black cursor-pointer disabled:bg-gray-400"
          >
            {isLoading ? "Saving...": "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
