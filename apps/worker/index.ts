import "dotenv/config";


import { popMessage } from "@repo/redis/queue"
import { db } from "@repo/db/db"
import { chat } from "@repo/db/schema";
import { redisConsumer, redisPublisher } from "@repo/redis/client";




async function worker() {
    console.log("🟢 Worker started");
    redisConsumer.on("connect", () => {
        console.log("connected consumer adad")
    })

    redisConsumer.on("error", (er) => {
       console.log(er)
    })

    redisPublisher.on("connect", () => {
        console.log("connected publisher adad")
    })

    redisPublisher.on("error", (er) => {
       console.log(er)
    })

    

    while(true){
        console.log("Adad")
        const job = await popMessage()
        console.log(job)

        if(!job) continue

        try {
            await db.insert(chat).values({
                message: job.message,
                roomId: parseInt(job.roomId),
                userId: job.userId
            })
        } catch (error) {
            console.error("Failed to process job", error);
        }
    }
}


worker()
