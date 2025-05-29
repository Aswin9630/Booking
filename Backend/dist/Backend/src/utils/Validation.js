"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.check)("firstName", "First Name is required").isString().notEmpty(),
    (0, express_validator_1.check)("lastName", "Last Name is required").isString().notEmpty(),
    (0, express_validator_1.check)("email", "Valid Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password must be 6 to 20 characters long")
        .isLength({ min: 6, max: 20 })
        .bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .withMessage("Password must include uppercase, lowercase, number, and special character"),
];
exports.loginValidation = [
    (0, express_validator_1.check)("email", "Email is Required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters required").isLength({
        min: 6,
        max: 20,
    }),
];
exports.hotelValidation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is Required"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("City is Required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("Country is Required"),
    (0, express_validator_1.body)("desciption").notEmpty().withMessage("Desciption is Required"),
    (0, express_validator_1.body)("type").notEmpty().withMessage("Hotel type is Required"),
    (0, express_validator_1.body)("pricePerNight").notEmpty().isNumeric().withMessage("Price Per Night is Required & must be a number"),
    (0, express_validator_1.body)("facilities").notEmpty().isArray().withMessage("Facilities is Required "),
];
