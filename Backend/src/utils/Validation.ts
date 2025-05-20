import { body, check } from "express-validator";

export const registerValidation = [
  check("firstName", "First Name is required").isString().notEmpty(),
  check("lastName", "Last Name is required").isString().notEmpty(),
  check("email", "Valid Email is required").isEmail(),
  check("password", "Password must be 6 to 20 characters long")
    .isLength({ min: 6, max: 20 })
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage("Password must include uppercase, lowercase, number, and special character"),
];

export const loginValidation = [
   check("email", "Email is Required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
      max: 20,
    }),
]


export const hotelValidation = [
  body("name").notEmpty().withMessage("Name is Required"),
  body("city").notEmpty().withMessage("City is Required"),
  body("country").notEmpty().withMessage("Country is Required"),
  body("desciption").notEmpty().withMessage("Desciption is Required"),
  body("type").notEmpty().withMessage("Hotel type is Required"),
  body("pricePerNight").notEmpty().isNumeric().withMessage("Price Per Night is Required & must be a number"),
  body("facilities").notEmpty().isArray().withMessage("Facilities is Required "),
]