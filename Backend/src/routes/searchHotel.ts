import express, { Request, Response } from "express";
import Hotel from "../model/hotelModel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/verifyToken";
import User from "../model/userModel";
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOptions) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.status(200).json({ response });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("ID is required")],
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();
    try {
      const hotel = await Hotel.findById(id);
      res.status(200).json(hotel);
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    const { numberOfNight } = req.body;
    const hotelId = req.params.hotelId;
    const userId = req.userId as string;
    try {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(400).json("Hotel not found");
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json("User not found");
      }

      const totalCost = hotel.pricePerNight * numberOfNight;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "INR",
        description: "Booking room at NextStay.com",
        metadata: {
          hotelId,
          userId,
        },
        shipping: {
          name: user?.firstName,
          address: {
            line1: "123 Default Street",
            city: "Your City",
            state: "Your State",
            postal_code: "000000",
            country: "IN",
          },
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      if (!paymentIntent.client_secret) {
        return res
          .status(500)
          .json({ message: "Error creating payment intent" });
      }

      const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
      };
      res.send(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "Payment intent not found" });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment intent mismatch" });
      }
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment intent not succeeded, Status: ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        { $push: { bookings: newBooking } }
      );

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }
      await hotel.save();

      res.status(200).json({ message: "Booking saved successfully" }); 
      
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }
  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }
  if (queryParams.types) {
    constructedQuery.types = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRating = parseInt(queryParams.stars.toString());
    constructedQuery.starRating = { $eq: starRating };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;
