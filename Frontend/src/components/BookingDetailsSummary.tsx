import type { HotelType } from "../../../Backend/src/shared/types";

type Props= {
    checkIn:Date;
    checkOut:Date;
    adultCount:number;
    childCount:number;
    numberOfNight:number;
    hotel:HotelType;
}
const BookingDetailsSummary = ({checkIn,checkOut,adultCount,childCount,numberOfNight,hotel} : Props) => {
    const validChildCount = isNaN(childCount) ? 0 : childCount;
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
        <h2 className="text-xl font-bold tracking-tight text-center">Your Booking Details</h2>
        <div className="border-b border-gray-400 py-2 ">
            Location:
            <div className="font-semibold">{` ${hotel?.name}, ${hotel?.city}, ${hotel?.country}`}</div>
        </div>
        <div className="flex justify-between gap-3 md:gap-2">
            <div>
                Check-In:
                <div className="font-semibold">{checkIn.toDateString()}</div>
            </div>
            <div>
                Check-Out:
                <div className="font-semibold">{checkOut.toDateString()}</div>
            </div>
        </div>
        <div className="border-t border-b border-gray-400 py-2">
            Total number of days:
            <div className="font-semibold">
                {numberOfNight}
            </div>
        </div>
        <div>
            Guests
            <div className="font-semibold">
                {adultCount} Adults{validChildCount > 0 && <span> & {validChildCount} Child</span>}
            </div>
        </div>
    </div>
  )
}

export default BookingDetailsSummary