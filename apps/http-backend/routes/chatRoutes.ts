import { db } from "@repo/db/db"
import type { Request, Response } from "express"

export async function getRoomChatsRoute(req: Request, res:Response){
    try {
        const {roomId} = req.params
    
        if(!roomId){
            return res.json({
                message: "Room ID is required"
            }).status(403)
        }

        const chats = await db.query.chat.findMany({
            where: (chat, {eq}) => eq(chat.roomId,parseInt(roomId)),
            limit: 50,
            orderBy: (chat, {asc}) => [asc(chat.createdAt)]
        })

        return res.json({
            messages: chats
        })
    } catch (error) {
        console.log(error)
    }
}