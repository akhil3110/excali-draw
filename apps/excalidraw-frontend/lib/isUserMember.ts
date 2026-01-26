"use server"
import {db} from "@repo/db/db"
import { canvasUsers } from "@repo/db/schema";
import { and, exists } from "drizzle-orm";

export async function isUserMemberOrAdmin(userId: string, canvasId: string) {
    try {
        
        const result = await db.query.canvas.findFirst({
            where: (c , {eq,or}) =>
                or(
                   and(eq(c.id, Number(canvasId)), eq(c.adminId, userId)),

                   and(
                    eq(c.id,Number(canvasId)),
                    exists(
                        db.select().from(canvasUsers).where(
                            and(
                                eq(canvasUsers.canvasId,c.id),
                                eq(canvasUsers.memberId,userId)
                            )
                        )
                    )
                   )
                )
        })
        return !!result;


    } catch (error) {
        console.log(error)
    }
}