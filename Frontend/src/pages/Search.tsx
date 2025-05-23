import { useSearchContext } from "../context/SearchContext";
import * as apiClient from "../api-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelType, setSelectedHotelType] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sortOptions, setSortOptions] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars:selectedStars,
    types:selectedHotelType,
    facilities:selectedFacilities,
    sortOptions

  };

  const { data: hotelData } = useQuery({
    queryKey: ["searchHotels", searchParams],
    queryFn: () => apiClient.searchhotels(searchParams),
  });

  const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hotelType = event.target.value;

    setSelectedHotelType((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((type) => type !== hotelType)
    );
  };
  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facilities = event.target.value;

    setSelectedFacilities((prevFacility) =>
      event.target.checked
        ? [...prevFacility, facilities]
        : prevFacility.filter((facility) => facility !== facilities)
    );
  };

  return (
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5 mx-auto container px-6 md:px-10">
      <div className="bg-white rounded-b-lg border border-slate-300 p-5 h-fit md:sticky top-0">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter By:
          </h3>
          <StarRatingFilter selectedStars={selectedStars} onChange={handleStarChange}/>
          <HotelTypesFilter selectedHotelType={selectedHotelType} onChange={handleHotelTypeChange}/>
          <FacilitiesFilter selectedFacilities={selectedFacilities} onChange={handleFacilityChange}/>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination?.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select value={sortOptions} onChange={(e)=>setSortOptions(e.target.value)} className="p-2 border rounded-md">
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">Price(low to high)</option>
            <option value="pricePerNightDesc">Price(high to low)</option>
          </select>
        </div>
        {(hotelData?.data ?? []).map((hotel) => (
          <SearchResultCard key={hotel._id} hotel={hotel} />
        ))}

        <div>
          <Pagination
          total={hotelData?.pagination?.total || 1 }
            page={hotelData?.pagination?.page || 1}
            pages={hotelData?.pagination?.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
