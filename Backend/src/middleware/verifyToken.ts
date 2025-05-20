import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

declare global {
    namespace Express{
        interface Request{
            userId?:string
        }
    }
}

const verifyToken = (req:Request, res:Response, next:NextFunction):void=>{
    const token = req.cookies.accessToken
    
    if(!token){
         res.status(401).json({message:"No Access token"});
         return;
    }
        try {
             const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayload
             req.userId = decoded.id
             next();
        } catch (error:any) {
             res.status(500).json({success:false, message:error.message});
             return;
        }
    
}

export default verifyToken;