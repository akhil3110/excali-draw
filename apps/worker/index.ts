import "dotenv/config";


import { popMessage } from "@repo/redis/queue"
import { db } from "@repo/db/db"
import { chat, shapes } from "@repo/db/schema";
import { redisConsumer, redisPublisher } from "@repo/redis/client";
import {and, eq} from "drizzle-orm";



async function worker() {
    console.log("🟢 Worker started");

    redisConsumer.on("connect", () => {
        console.log("connected consumer")
    })

    redisConsumer.on("error", (er) => {
       console.log(er)
    })

    redisPublisher.on("connect", () => {
        console.log("connected publisher")
    })

    redisPublisher.on("error", (er) => {
       console.log(er)
    })

      

    while(true){
        const job = await popMessage()
        console.log(job,"job")

        if(!job) continue

        try {
            switch (job.type) {
                case "chat":
                    await db.insert(chat).values({
                        message: job.message,
                        roomId: parseInt(job.roomId),
                        userId: job.userId
                    })
                    break;
                case "shapes":
                    const payload = JSON.parse(job.shape)
                    const shape = payload.shape
                    console.log(shape,"shape")
                    if(!shape || !shape.type){
                        throw new Error("Invalid shape")
                    }

                    const shapeId = shape.id

                    if(!shapeId){
                        throw new Error("Shape id is required")
                    }

                    if(job.action === "delete"){
                        await db.delete(shapes).where(
                            and(
                                eq(shapes.id, shapeId),
                                eq(shapes.userId, job.userId)
                            )
                        )
                        break;
                    }

                    await db.insert(shapes).values({
                        id: shapeId,
                        canvasId: parseInt(job.roomId),
                        userId: job.userId,
                        type: shape.type,
                        data: shape
                    })


                    // await db.insert(shapes).values({
                    //     id: s.id,
                    //     canvasId: parseInt(job.canvasId),
                    //     userId: job.userId,
                    //     type: job.shape.type,
                    //     data: job.shape
                    // })
            }
        } catch (error) {
            console.error("Failed to process job", error);
        }
    }
}


worker()
