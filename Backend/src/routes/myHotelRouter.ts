import express, { Request, Response } from "express";
import upload from "../middleware/multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../model/hotelModel";
import verifyToken from "../middleware/verifyToken";
import { hotelValidation } from "../utils/Validation";
const router = express.Router();

router.post(
  "/my-hotels",
  verifyToken,
  hotelValidation,
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageurls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageurls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();
      res.status(201).send(hotel);
    } catch (error: any) {
      console.error("Failed to add hotel:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/my-hotels", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    if (hotels.length === 0) {
      res.status(200).json({ message: "No Hotels Found" });
    }
    res.status(201).json({ hotels });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get(
  "/my-hotels/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
      const hotels = await Hotel.findOne({
        _id: id,
        userId: req.userId,
      });

      res.status(201).json(hotels);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/my-hotels/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "No Hotel Found" });
      }
      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];
      await hotel.save();
      res.status(201).json(hotel)
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const base64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + base64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageurls = await Promise.all(uploadPromises);
  return imageurls;
}

export default router;
