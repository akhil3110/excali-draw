import jwt from "jsonwebtoken";


export function verifyToken(token: string) {
    try {
        
        const decodedToken = jwt.decode(token) as jwt.JwtPayload;

        if (!decodedToken || decodedToken!.exp! < Date.now() / 1000) {
            console.log("Token expired");
            return false;
        }

        return true;

    } catch (error) {
        console.log("Token verification failed:", error);
    }
}