import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api-client"

const Booking = () => {

    const {data:userDetails} = useQuery({
        queryKey:["getUserDetails"],
        queryFn:apiClient.getUserProfile
    })
    
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <div className="bg-gray-300">Booking Details</div>
    </div>
  )
}

export default Booking