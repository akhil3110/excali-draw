import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import { JWT_SECERET } from "@repo/backend-common/secret";


export function middleware(req: Request,res: Response,next: NextFunction){

    const token = req.headers["authorization"] ?? ""  

    const decoded = jwt.verify(token,JWT_SECERET) as JwtPayload & {userId: string}

    if(decoded)  {
        req.userId = decoded.userId;
        next()
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
} 