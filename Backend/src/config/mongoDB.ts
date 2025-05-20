import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        if(!process.env.MONGODB_CONNECTION_URL){
            throw new Error("Database Connection_Url is not defined");
        }
        await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
        console.log("Database connected");
    } catch (error:any) {
       console.error("❌ Error connecting to DB:", error.message);
       process.exit(1)
    }
}