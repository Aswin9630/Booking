import express, { Request, Response } from "express";
import verifyToken from "../middleware/verifyToken";
import Hotel from "../model/hotelModel";
import { HotelType } from "../../../shared/types";
const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response):Promise<any> => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );
      const hotelWithUserBookings:HotelType = {
          ...hotel.toObject(),
          bookings:userBookings,
      };
      return hotelWithUserBookings;
    });

    res.status(200).json(results); 

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
