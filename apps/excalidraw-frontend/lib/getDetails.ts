import { JWT_SECRET } from "@/config";
import jwt from "jsonwebtoken";


export function getName (token: string) {
    try {

        const decodedToken = jwt.decode(token) as jwt.JwtPayload;
        return decodedToken.name

    } catch (error) {
        console.error("Token decoding failed:", error);
    }
}

export  function getUserId (token: string) {
    try {
        const decodedToken = jwt.decode(token) as jwt.JwtPayload;
        return decodedToken.userId;
    } catch (error) {
        console.error("Token verification failed:", error);
    }
}