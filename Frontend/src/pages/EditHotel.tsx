import { useParams } from "react-router-dom"
import ManageHotelForm from "../form/ManageHotelForm/ManageHotelForm"
import { useMutation, useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client"

const EditHotel = () => {
    const {hotelId} = useParams();

    const {data:hotel} = useQuery({
        queryKey:["fetchMyHotelById"],
        queryFn: ()=> apiClient.fetchMyHotelsById(hotelId || ''),
        enabled:!!hotelId
    })

    const { mutate , isPending} = useMutation({
        mutationFn:apiClient.updateMyHotelById,
        onSuccess:()=>{},
        onError:()=>{},
    })

    const handleSave = (hotelFormData:FormData)=>{
        mutate(hotelFormData);
    }

    if(!hotel) {
        return <span className="font-bold text-3xl text-center">Loading....</span>
    }

     

  return (
   <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isPending}/>
  )
}

export default EditHotel