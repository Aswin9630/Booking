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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = __importDefault(require("../model/userModel"));
const generateToken_1 = require("../utils/generateToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Validation_1 = require("../utils/Validation");
const express_validator_1 = require("express-validator");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = express_1.default.Router();
router.post("/register", Validation_1.registerValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array() });
    }
    try {
        const { email, password, firstName, lastName } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            return res.status(401).json({ message: "email already exist" });
        }
        const newUser = new userModel_1.default({ email, password, firstName, lastName });
        yield newUser.save();
        const token = (0, generateToken_1.generateToken)(res, newUser._id);
        const _a = newUser.toObject(), { password: _ignored } = _a, userDetails = __rest(_a, ["password"]);
        return res
            .status(200)
            .json({
            success: true,
            message: "Registered Successfully",
            userDetails,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
router.post("/login", Validation_1.loginValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userExist = yield userModel_1.default.findOne({ email });
        if (!userExist) {
            return res
                .status(401)
                .json({ success: false, message: "User Not Found" });
        }
        const pwdMatch = yield bcryptjs_1.default.compare(password, userExist.password);
        if (!pwdMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Incorrect Credentials" });
        }
        const token = (0, generateToken_1.generateToken)(res, userExist._id);
        const _a = userExist.toObject(), { password: _ignored } = _a, userDetails = __rest(_a, ["password"]);
        res
            .status(200)
            .json({ success: true, message: "Login Success", userDetails });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
router.get("/profile", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield userModel_1.default.findById(userId).select("-password");
        if (!user)
            return res.status(400).json({ message: "User not found" });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post("/logout", (req, res) => {
    res.cookie("accessToken", "", { expires: new Date(0) });
    res.status(200).json({ success: true, message: "Logout Successfully" });
    res.send();
});
router.get("/verifyToken", verifyToken_1.default, (req, res) => {
    res.status(200).json({ success: true, message: req.userId });
});
exports.default = router;
