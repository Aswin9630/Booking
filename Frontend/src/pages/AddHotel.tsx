import { useMutation } from "@tanstack/react-query"
import ManageHotelForm from "../form/ManageHotelForm/ManageHotelForm"
import { useAppContext } from "../context/AppContext"
import * as apiClient from "../api-client"

const AddHotel = () => {
  const { showToast} = useAppContext();
  const {mutate,isPending} = useMutation({
    mutationFn:apiClient.addMyHotel,
    onSuccess:()=>{
      showToast({message:"Hotel Saved", type:"SUCCESS"});
    },
    onError:()=>{
      showToast({message:"Error Saving Hotel", type:"FAILURE"})
    }
  }); 


  const handleSave = (HotelformData:FormData)=>{
    mutate(HotelformData)
  }


  return (
    <div className="mx-5 md:mx-25">
        <ManageHotelForm onSave={handleSave} isLoading={isPending}/>
    </div>
  )
}

export default AddHotel