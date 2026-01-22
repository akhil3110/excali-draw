import { AddUsersToCanvasSchema, CreateCanvasSchema } from "@repo/common/types";
import { db } from "@repo/db/db";
import { canvas, canvasUsers, chat, user } from "@repo/db/schema";
import type { Request, Response } from "express";
import { and, eq, exists } from "drizzle-orm";


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
            adminId: req.userId
        }).returning({id:canvas.id})

        return res.json({
            canvasId: Newcanvas[0]!.id
        })

    } catch (error) {
        console.log(error)
    }
}

export async function AddUsersToCanvasRoute(req: Request, res: Response) {
    try {
        
        const data = AddUsersToCanvasSchema.safeParse(req.body);
        const {id} = req.params

        if(!data.success){
            console.log(data)
            return res.json({
                message: "Invalid inputs",
            }).status(403)
        }
        console.log(data)
        console.log(id, "canvasId")
        console.log(req.userId, "req user")
        console.log(req.params, "req params")



        if(!req.userId || !id){
            console.log(req.userId, "adad")
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

        if(canvasExist.adminId !== req.userId){
            console.log(canvasExist.adminId)
            console.log(req.userId)
            return res.json({
                message: "Unauthorized access",
            }).status(403)
        }
        
        let newMemberId=req.userId;
        if(data.data.email !== undefined && data.data.email !== null){
            const foundUser = await db.query.user.findFirst({
                where: (user, { eq }) => eq(user.email, data.data.email as string)
            })

            if(!foundUser){
                return res.json({
                    message: "User not found",
                    userAlreadyMember: false,
                    userAdded: false,
                    userNotExists: true
                }).status(403)
            }
            newMemberId = foundUser.id
        }
        
        const userAlreadyMember = await db.query.canvasUsers.findFirst({
            where: (canvasUsers, {eq}) => eq(canvasUsers.memberId, newMemberId)
        })

        if(userAlreadyMember){
            return res.json({
                message: "User already member",
                userAlreadyMember: true,
                userAdded: false,
                userNotFound: false
            }).status(403)
        }

        await db.insert(canvasUsers).values({
            canvasId: canvasExist.id,
            memberId: newMemberId
        })

        return res.json({
            message: "User added to canvas",
            userAlreadyMember: false,
            userAdded: true,
            userNotFound: false
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
            where: (canvas,{eq}) => eq(canvas.adminId,req.userId!),
            with: {
                canvasUsers: true,
                admin: {
                    columns: {
                        email: true,
                        name: true
                    }
                }
            }
        })

        const memberCanvas = await db.query.canvas.findMany({
            where: (canvas,{eq}) => 
                exists(
                    db.select().from(canvasUsers).where(
                        and(
                            eq(canvasUsers.canvasId,canvas.id),
                            eq(canvasUsers.memberId,req.userId!)
                        )
                    )
                ),
                with: {
                    canvasUsers: true,
                    admin: {
                        columns: {
                            email: true,
                            name: true
                        }
                    }
                }
        })
        return res.json({
            canvases,
            memberCanvas
        })
    } catch (error) {
        console.log(error)
    }
}

export async function getCanvasByIdRoute(req: Request, res: Response) {
    try {
        
        const {id} = req.params

        if(!req.userId || !id){
            return res.json({
                message: "Unauthorized access"
            }).status(403)
        }

        const canvasExist = await db.query.canvas.findFirst({
            where: (canvas, {eq}) => eq(canvas.id, parseInt(id)),
            with: {
                canvasUsers: true,
                admin: {
                    columns: {
                        email: true,
                        name: true
                    }
                }
            }
        })



        if(!canvasExist){
            return res.json({
                message: "Canvas not found"
            }).status(403)
        }

        if(canvasExist.adminId !== req.userId){
            return res.json({
                message: "Unauthorized access"
            }).status(403)
        }

        return res.json({
            canvas: canvasExist
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

        if(canvasExist.adminId !== req.userId){
            return res.json({
                message: "Unauthorized access"
            }).status(403)
        }

        const remainingCanvas = await db.transaction(async (tx) => {
            await tx.delete(canvas).where(eq(canvas.id,canvasExist.id))

            return await tx.select().from(canvas).where(eq(canvas.adminId,req.userId!))
        })

        await db.delete(canvas).where(eq(canvas.id,canvasExist.id)).returning()
        return res.json({
            canvas: remainingCanvas
        })
        
    } catch (error) {
        console.log(error)
    }
}