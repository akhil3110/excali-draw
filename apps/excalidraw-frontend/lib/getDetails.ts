import { JWT_SECRET } from "@/config";
import jwt from "jsonwebtoken";


export const getName = (token: string) => {
    try {

        const decodedToken = jwt.decode(token) as jwt.JwtPayload;
        console.log("Decoded Token:", decodedToken);
        return decodedToken.name

    } catch (error) {

    }
}