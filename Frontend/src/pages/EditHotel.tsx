import { useNavigate, useParams } from "react-router-dom"
import ManageHotelForm from "../form/ManageHotelForm/ManageHotelForm"
import { useMutation, useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client"
import { useAppContext } from "../context/AppContext";

const EditHotel = () => {
    const {hotelId} = useParams();
    const {showToast} = useAppContext()
    const navigate = useNavigate();

    const {data:hotel} = useQuery({
        queryKey:["fetchMyHotelById"],
        queryFn: ()=> apiClient.fetchMyHotelsById(hotelId || ''),
        enabled:!!hotelId
    })

    const { mutate , isPending} = useMutation({
        mutationFn:apiClient.updateMyHotelById,
         onSuccess:()=>{
            showToast({message:"Hotel Saved", type:"SUCCESS"})
            navigate("/my-hotels");
    },
    onError:()=>{
        showToast({message:"Failed to Edit Hotel", type:"FAILURE"})
        navigate("/my-hotels");
    }
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