import { CreateCanvasSchema } from "@repo/common/types";
import { db } from "@repo/db/db";
import { canvas, chat } from "@repo/db/schema";
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";


export async function createCanvasRoute(req: Request,res: Response) {
    try {
        
        const data =  CreateCanvasSchema.safeParse(req.body);

        if(!data.success){
            return res.json({
                message: "Invalid inputs"
            }).status(403)
        }

        if(!req.userId){
            return res.json({
                message: "Unauthorized access"
            }).status(403)
        }

        if (!data.data.name) {
            return res.json({ message: "Name is required" }).status(403);
        }

        const Newcanvas = await db.insert(canvas).values({
            name: data.data.name,
            userId: req.userId
        }).returning({id:canvas.id})

        return res.json({
            canvasId: Newcanvas[0]!.id
        })

    } catch (error) {
        console.log(error)
    }
}


export async function getAllCanvasRoute(req: Request, res: Response) {
    try {
         if(!req.userId){
            return res.json({
                message: "Unauthorized access"
            }).status(403)
        }

        const canvases = await db.query.canvas.findMany({
            where: (canvas,{eq}) => eq(canvas.userId,req.userId!)
        })
        return res.json({
            canvases
        })
    } catch (error) {
        console.log(error)
    }
}

export async function deleteCanvasRoute(req: Request, res: Response) {
    try {
        const {id} = req.params

        if(!req.userId || !id){
            return res.json({
                message: "Unauthorized access"
            }).status(403)
        }


        const canvasExist = await db.query.canvas.findFirst({
            where: (canvas, {eq}) => eq(canvas.id, parseInt(id))
        })

        if(!canvasExist){
            return res.json({
                message: "Canvas not found"
            }).status(403)
        }

        if(canvasExist.userId !== req.userId){
            return res.json({
                message: "Unauthorized access"
            }).status(403)
        }

        const remainingCanvas = await db.transaction(async (tx) => {
            await tx.delete(canvas).where(eq(canvas.id,canvasExist.id))

            return await tx.select().from(canvas).where(eq(canvas.userId,req.userId!))
        })

        await db.delete(canvas).where(eq(canvas.id,canvasExist.id)).returning()
        return res.json({
            canvas: remainingCanvas
        })
        
    } catch (error) {
        console.log(error)
    }
}