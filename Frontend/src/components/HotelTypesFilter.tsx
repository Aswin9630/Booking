import type React from "react";
import { hotelTypes } from "../config/hotel-options-config";

type Props = {
  selectedHotelType: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelTypesFilter = ({ selectedHotelType, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Hotel Type:</h4>
      {hotelTypes.map((hotelType) => (
        <label key={hotelType} className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded cursor-pointer"
            value={hotelType}
            checked={selectedHotelType.includes(hotelType)}
            onChange={onChange}
          />
          <span>{hotelType}</span>
        </label>
      ))}
    </div>
  );
};

export default HotelTypesFilter;
