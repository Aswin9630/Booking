import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api-client"
import { useParams } from "react-router-dom"
import { AiFillStar } from "react-icons/ai"
import GuestInfoForm from "../form/GuestInfoForm"
import Spinner from "../components/Spinner"

const HotelDetails = () => {
    const {hotelId} = useParams()
    const {data:hotel} = useQuery({
        queryKey:["fetchHotelbyId", hotelId],
        queryFn:()=>apiClient.fetchhotelById(hotelId as string),
        enabled:!!hotelId
    });

    if(!hotel){
        return <div className="text-center text-2xl my-5"><Spinner/></div>
    }

  return (
    <div className="p-5 container mx-auto mt-10">
        <div>
            <span className="flex">
                {Array.from({length:hotel.starRating}).map(()=>(
                    <AiFillStar className="fill-yellow-400"/>
                ))}
            </span>
            <h1 className="text-2xl font-bold ">{hotel.name}</h1>          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {hotel.imageUrls.map((image,index)=>(
                <div key={index} className="h-[300px] w-[250px] p-5">
                    <img src={image} alt={hotel.name} className="rounded-md w-full h-full object-cover object-center"/>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-5 text-center text-gray-700 font-semibold">
            {hotel.facilities.map((facility,index)=>(
                <div key={index} className="border border-slate-300 rounded-sm p-3">{facility}</div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mt-5 text-gray-700 gap-5">
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="h-fit">
                <GuestInfoForm hotelId={hotel._id} pricePerNight={hotel.pricePerNight}/>
            </div>
        </div>
    </div>
  )
}

export default HotelDetails