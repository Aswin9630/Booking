"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const mongoDB_1 = require("./config/mongoDB");
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const cloudinary_1 = require("cloudinary");
const myHotelRouter_1 = __importDefault(require("./routes/myHotelRouter"));
const searchHotel_1 = __importDefault(require("./routes/searchHotel"));
const MyBookingsRouter_1 = __importDefault(require("./routes/MyBookingsRouter"));
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET
});
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../Frontend/dist")));
app.use("/auth", userRouter_1.default);
app.use("/api/my-hotels", myHotelRouter_1.default);
app.use("/api/hotels", searchHotel_1.default);
app.use("/api/my-bookings", MyBookingsRouter_1.default);
const serverAndDBconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoDB_1.connectDB)();
        app.listen(PORT, () => {
            console.log("Server Successfully running on port: " + PORT);
        });
    }
    catch (error) {
        console.error("Failed to connect to DB or server:", error.message);
        process.exit(1);
    }
});
serverAndDBconnect();
