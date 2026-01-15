import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import { JWT_SECERET } from "@repo/backend-common/secret";


export function middleware(req: Request,res: Response,next: NextFunction){

    try {
        let token = req.cookies?.token;
        
        if(!token && req.headers["authorization"]){
            token = req.headers["authorization"]; 
        }

        if (!token) {
            return res.status(401).json({ message: "Token missing adad" });
        }

        const decoded = jwt.verify(token,JWT_SECERET) as JwtPayload;

        req.userId = decoded.userId;
        
        return next()

    } catch (error) {
        console.log(error)
        return  res.status(403).json({
                    message: "Unauthorized middleware"
                })
    }

} 