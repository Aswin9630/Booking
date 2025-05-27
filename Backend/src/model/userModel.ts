import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import { UserType } from "../shared/types";



const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim:true
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      minLength:[4,"FirstName should be atleast min-4 Char & max-20 Char"],
      maxLength:20
    },
    lastName: {
      type: String,
      required: true,
      minlength:[1,"Lastname must be atleast min-1 & max-20 char"],
      maxlength:[20,"Lastname must be atleast min-1 & max-20 char"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        const hashed = await bcrypt.hash(this.password, 10)
        this.password = hashed;
    }
    next();
})

const User = mongoose.model<UserType>("User",userSchema);

export default User;
