import { useSearchContext } from "../context/SearchContext";
import * as apiClient from "../api-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState(1);
  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
  };

  const { data: hotelData } = useQuery({
    queryKey: ["searchHotels", searchParams],
    queryFn: () => apiClient.searchhotels(searchParams),
  });
  return (
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5 mx-auto container px-6 md:px-10">
      <div className="bg-white rounded-b-lg border border-slate-300 p-5 h-fit md:sticky top-0">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter By:
          </h3>
          {/* todo filters */}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination?.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          {/* Todo sort options */}
        </div>
        {(hotelData?.data ?? []).map((hotel) => (
          <SearchResultCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Search;
