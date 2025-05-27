import express, { Request, Response } from "express";
import User from "../model/userModel";
import { generateToken } from "../utils/generateToken";
import bcrypt from "bcryptjs";
import {loginValidation, registerValidation} from "../utils/Validation";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/verifyToken";
const router = express.Router();

router.post(
  "/register",
  registerValidation,
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        return res.status(401).json({ message: "email already exist" });
      }
      const newUser = new User({ email, password, firstName, lastName });
      await newUser.save();
      const token = generateToken(res, newUser._id);

      const { password: _ignored, ...userDetails } = newUser.toObject();

      return res
        .status(200)
        .json({
          success: true,
          message: "Registered Successfully",
          userDetails,
        });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.post(
  "/login",
 loginValidation,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
      const userExist = await User.findOne({ email });
      if (!userExist) {
        return res
          .status(401)
          .json({ success: false, message: "User Not Found" });
      }

      const pwdMatch = await bcrypt.compare(password, userExist.password);
      if (!pwdMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect Credentials" });
      }

      const token = generateToken(res, userExist._id);
      const { password: _ignored, ...userDetails } = userExist.toObject();
      res
        .status(200)
        .json({ success: true, message: "Login Success", userDetails });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
); 
 
router.get("/profile", verifyToken, async(req:Request, res:Response):Promise<any>=>{
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if(!user) return res.status(400).json({message:"User not found"})
      res.status(200).json(user);
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
})

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("accessToken", "", { expires: new Date(0) });
  res.status(200).json({ success: true, message: "Logout Successfully" });
  res.send();
});

router.get("/verifyToken", verifyToken, (req, res) => {
  res.status(200).json({ success: true, message: req.userId });
});

export default router;
