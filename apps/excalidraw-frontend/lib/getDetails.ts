import jwt, { JwtPayload } from "jsonwebtoken";

export function getUserId(token: string) {
    try {
        const decodedToken = jwt.decode(token) as JwtPayload | null;

        if (!decodedToken || typeof decodedToken !== "object") {
            return null;
        }

        return decodedToken.userId ?? null;
    } catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
}

export function getEmail(token: string) {
    try {
        const decodedToken = jwt.decode(token) as JwtPayload | null;

        if (!decodedToken || typeof decodedToken !== "object") {
            return null;
        }

        return decodedToken.userId ?? null;
    } catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
}

export function getName(token: string) {
    try {
        const decodedToken = jwt.decode(token) as JwtPayload | null;

        if (!decodedToken || typeof decodedToken !== "object") {
            return null;
        }

        return decodedToken.name ?? null;
    } catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
}
