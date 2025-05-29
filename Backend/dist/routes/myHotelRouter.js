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
const multer_1 = __importDefault(require("../middleware/multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const hotelModel_1 = __importDefault(require("../model/hotelModel"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const Validation_1 = require("../utils/Validation");
const router = express_1.default.Router();
router.post("/", verifyToken_1.default, Validation_1.hotelValidation, multer_1.default.array("imageFiles", 6), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFiles = req.files;
        const newHotel = req.body;
        const imageurls = yield uploadImages(imageFiles);
        newHotel.imageUrls = imageurls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;
        const hotel = new hotelModel_1.default(newHotel);
        yield hotel.save();
        res.status(201).send(hotel);
    }
    catch (error) {
        console.error("Failed to add hotel:", error);
        res.status(500).json({ message: error.message });
    }
}));
router.get("/", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield hotelModel_1.default.find({ userId: req.userId });
        if (hotels.length === 0) {
            return res.status(200).json({ message: "No Hotels Found" });
        }
        return res.status(201).json({ hotel: hotels });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get("/:id", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id.toString();
    try {
        const hotels = yield hotelModel_1.default.findById({ _id: id, userId: req.userId });
        res.status(201).json(hotels);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.put("/:hotelId", verifyToken_1.default, multer_1.default.array("imageFiles"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedHotel = req.body;
        updatedHotel.lastUpdated = new Date();
        const hotel = yield hotelModel_1.default.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,
        }, updatedHotel, { new: true });
        if (!hotel) {
            return res.status(404).json({ message: "No Hotel Found" });
        }
        const files = req.files;
        const updatedImageUrls = yield uploadImages(files);
        hotel.imageUrls = [
            ...updatedImageUrls,
            ...(updatedHotel.imageUrls || []),
        ];
        yield hotel.save();
        res.status(201).json(hotel);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
function uploadImages(imageFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadPromises = imageFiles.map((image) => __awaiter(this, void 0, void 0, function* () {
            const base64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + base64;
            const res = yield cloudinary_1.default.v2.uploader.upload(dataURI);
            return res.url;
        }));
        const imageurls = yield Promise.all(uploadPromises);
        return imageurls;
    });
}
exports.default = router;
