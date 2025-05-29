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
const hotelModel_1 = __importDefault(require("../model/hotelModel"));
const express_validator_1 = require("express-validator");
const stripe_1 = __importDefault(require("stripe"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const router = express_1.default.Router();
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY);
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = yield hotelModel_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);
        const total = yield hotelModel_1.default.countDocuments(query);
        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };
        res.status(200).json({ response });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield hotelModel_1.default.find().sort("-lastUpdated");
        res.status(200).json(hotels);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get("/:id", [(0, express_validator_1.param)("id").notEmpty().withMessage("ID is required")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();
    try {
        const hotel = yield hotelModel_1.default.findById(id);
        res.status(200).json(hotel);
    }
    catch (error) {
        console.error(error.message);
    }
}));
router.post("/:hotelId/bookings/payment-intent", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numberOfNight } = req.body;
    const hotelId = req.params.hotelId;
    const userId = req.userId;
    try {
        const hotel = yield hotelModel_1.default.findById(hotelId);
        if (!hotel) {
            return res.status(400).json("Hotel not found");
        }
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(400).json("User not found");
        }
        const totalCost = hotel.pricePerNight * numberOfNight;
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: totalCost * 100,
            currency: "INR",
            description: "Booking room at NextStay.com",
            metadata: {
                hotelId,
                userId,
            },
            shipping: {
                name: user === null || user === void 0 ? void 0 : user.firstName,
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post("/:hotelId/bookings", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntentId = req.body.paymentIntentId;
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent) {
            return res.status(400).json({ message: "Payment intent not found" });
        }
        if (paymentIntent.metadata.hotelId !== req.params.hotelId ||
            paymentIntent.metadata.userId !== req.userId) {
            return res.status(400).json({ message: "Payment intent mismatch" });
        }
        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({
                message: `Payment intent not succeeded, Status: ${paymentIntent.status}`,
            });
        }
        const newBooking = Object.assign(Object.assign({}, req.body), { userId: req.userId });
        const hotel = yield hotelModel_1.default.findOneAndUpdate({ _id: req.params.hotelId }, { $push: { bookings: newBooking } }, { new: true });
        if (!hotel) {
            return res.status(400).json({ message: "Hotel not found" });
        }
        // await hotel.save();
        res.status(200).json({ message: "Booking saved successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
}));
const constructSearchQuery = (queryParams) => {
    let constructedQuery = {};
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
exports.default = router;
