import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectDB } from "./config/mongoDB";
import userRouter from "./routes/userRouter"
import { v2 as cloudinary } from "cloudinary";
import hotelRoutes from "./routes/myHotelRouter";
import searchRoutes from "./routes/searchHotel";
import bookingRoutes from "./routes/MyBookingsRouter";
import path from "path";

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_KEY_SECRET
});

const PORT = process.env.PORT;
const app = express();
app.use(cookieParser())
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"../../Frontend/dist")))

app.use("/auth",userRouter);
app.use("/api/my-hotels",hotelRoutes);
app.use("/api/hotels",searchRoutes); 
app.use("/api/my-bookings",bookingRoutes); 

const serverAndDBconnect = async () => {   
  try {  
    await connectDB();  
    app.listen(PORT, () =>{
      console.log("Server Successfully running on port: " + PORT);
    })
     
  } catch (error:any) {
    console.error("Failed to connect to DB or server:", error.message);
    process.exit(1);
  } 
};
serverAndDBconnect();
