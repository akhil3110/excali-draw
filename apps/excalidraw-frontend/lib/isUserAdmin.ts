"use server"
import {db} from "@repo/db/db"
import jwt from "jsonwebtoken";

export async function isUserAdmin(token: string, canvasId: string) {
    try {

        const decoded = jwt.decode(token) as jwt.JwtPayload;
        console.log(decoded,"decoded")
        const userId = decoded?.userId
        console.log(userId,"userId")
        // const result = await db.query.canvas.findFirst({
        //     where: (c , {eq}) =>
        //         eq(c.id, Number(canvasId)) && eq(c.adminId, userId)
        // })
        // console.log(result,"result")
        // return !!result;

        return null

    } catch (error) {
        console.log(error)
    }
}