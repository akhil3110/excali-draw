import { CreateRoomSchema } from "@repo/common/types";
import { db } from "@repo/db/db";
import { room } from "@repo/db/schema";
import type { Request, Response } from "express";

export async function createRoomRoute(req: Request, res:Response){
    try {
        //db  call create a room
        
        const data = CreateRoomSchema.safeParse(req.body)
        
        if(!req.userId){
            return res.json({
                message: "Unauthorized access"
            }).status(403)
        }
        
        if(!data.success){
            return res.json({
                message: "Invalid inputs"
            }).status(403)
        }
        
        const roomExist = await db.query.room.findFirst({
            where: (room, {eq}) => eq(room.slug, data.data.name)
        })
        
        if(roomExist){
            return res.json({
                mesaage: "A room with this name already exist try with some other name",
                roomId: roomExist.id
            }).status(403)
        }
        
        const newRoom = await db.insert(room).values({
            slug: data.data.name,
            adminId: req.userId
        }).returning({id:room.id})
        
        return res.json({
            roomId: newRoom[0]!.id
        })
    } catch (error) {
        console.log(error)
    }
}

export async function getAllRoomsRoute(req: Request, res:Response){
    try {
        const rooms = await db.select().from(room);
        return res.json({
            rooms
        })
    } catch (error) {
        console.log(error)
    }
}

export async function getRoomRoute(req: Request, res:Response){
    try {
        const {roomId} = req.params
        console.log("Room ID:", roomId);
        
        if(!roomId){
            return res.json({
                message: "Room ID is required"
            }).status(403)
        }

        const roomDetails = await db.query.room.findFirst({
            where: (room, {eq}) => eq(room.id, parseInt(roomId)),
            with: {
                chats: true
            }
        })

        console.log("Room Details:", roomDetails);
    
        return res.json({
            roomDetails
        })
    } catch (error) {
        console.log(error)
    }
}