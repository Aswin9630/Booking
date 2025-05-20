import express, { Request, Response } from "express";
import upload from "../middleware/multer";
import cloudinary from "cloudinary"
import Hotel, { HotelType } from "../model/hotelModel";
import verifyToken from "../middleware/verifyToken";
import { hotelValidation } from "../utils/Validation";
const router = express.Router();

router.post("/my-hotels", verifyToken , hotelValidation,
    upload.array("imageFiles", 6)
    ,async (req: Request, res: Response) => {
       try {
         const imageFiles = req.files as Express.Multer.File[];
        const newHotel:HotelType = req.body;

        const uploadPromises = imageFiles.map(async(image)=>{
            const base64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," +base64;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url;
        })

        const imageurls = await Promise.all(uploadPromises);
        newHotel.imageUrls = imageurls;
        newHotel.lastUpdated =new Date();
        newHotel.userId = req.userId;


        const hotel = new Hotel(newHotel);
        await hotel.save();
        res.status(201).send(hotel);
        
       } catch (error:any) {
          console.error("Failed to add hotel:", error);
        res.status(500).json({message:error.message})
       }
});

export default router;
