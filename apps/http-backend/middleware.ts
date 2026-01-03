import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import { JWT_SECERET } from "@repo/backend-common/secret";


export function middleware(req: Request,res: Response,next: NextFunction){

    try {
        const token = req.headers["authorization"]; 
        console.log("Token from Header:", token);

        if(!token){
            return res.status(403).json({
                message: "Token Missing"
            })
        }

        const decoded = jwt.verify(token,JWT_SECERET) as string | JwtPayload;
        console.log("Decoded Token:", decoded);

        //@ts-expect-error: request userId assignment
        req.userId = decoded;
        
        return next()

    } catch (error) {
        return   res.status(403).json({
                    message: "Unauthorized middleware"
                })
    }

} 