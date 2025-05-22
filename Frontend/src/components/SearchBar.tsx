import { useState, type FormEvent } from "react";
import { useSearchContext } from "../context/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const search = useSearchContext();
  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  const navigate = useNavigate();
  const minDate = new Date()
  const maxDate = new Date()
  maxDate.setFullYear( maxDate.getFullYear() + 1 );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 p-5 bg-black rounded-2xl md:rounded-2xl lg:rounded-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 container mx-auto items-center"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-2 rounded-lg">
        <MdTravelExplore size={20} className="mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="text-md w-full focus:outline-none text-gray-600"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div className="flex px-2 py-1 bg-white rounded-lg">
        <label className="text-gray-500 font-semibold items-center flex">
          Adults:
          <input
            type="number"
            className=" p-1 focus:outline-none font-semibold"
            value={adultCount}
            min={1}
            max={20}
            onChange={(e) => setAdultCount(parseInt(e.target.value))}
          />
        </label>
        <label className="text-gray-500 font-semibold items-center flex">
          Child:
          <input
            type="number"
            className=" p-1 focus:outline-none font-semibold"
            value={childCount}
            min={0}
            max={20}
            onChange={(e) => setChildCount(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div className="flex gap-2 text-gray-500 font-semibold">
        <DatePicker selected={checkIn}
        onChange={(date)=>setCheckIn(date as Date)} 
        selectsStart
        startDate={checkIn}
        endDate={checkOut}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText="Check-In"
        className="w-full bg-white p-2 rounded-lg focus:outline-none"
        wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex gap-2 text-gray-500 font-semibold">
        <DatePicker selected={checkOut}
        onChange={(date)=>setCheckOut(date as Date)} 
        selectsStart
        startDate={checkOut}
        endDate={checkOut}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText="Check-In"
        className="w-full bg-white p-2 rounded-lg focus:outline-none"
        wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex gap-1">
        <button type="submit" className="w-2/3 bg-white rounded-lg p-2 font-semibold text-gray-500 hover:text-black cursor-pointer">
          Search
        </button>
        <button className="w-1/3 bg-white rounded-lg p-2 font-semibold text-gray-500 hover:text-black cursor-pointer">
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
