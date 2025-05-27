import { useQuery } from "@tanstack/react-query"
import Hero from "../components/Hero"
import * as apiClient from "../api-client"
import LatestHotelCard from "../components/LatestHotelCard";
import Spinner from "../components/Spinner";

const Home = () => {
  const {data:hotels} = useQuery({
    queryKey:["fetchAllHotels"],
    queryFn:apiClient.fetchAllHotels,
  });

  
  if (!hotels) {
    return <div className="text-center text-xl mt-10">
      <Spinner/>
    </div>;
  }

  const topRowHotels = hotels.slice(0,2) || [];
  const bottomRowHotels =hotels.slice(2) || [];
  return (
    <div>
      <Hero/>
      <div className="space-y-3 mx-auto container p-5">
        <p className="text-center">Recent Hotels added by our hosts</p>
        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {topRowHotels.map((hotel)=>(
              <LatestHotelCard hotel={hotel}/>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {bottomRowHotels.map((hotel)=>(
              <LatestHotelCard hotel={hotel}/>
            ))}
          </div>
        </div>
       
      </div>
    </div>
  )
}

export default Home