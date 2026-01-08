import "dotenv/config";

import { redisConsumer, redisPublisher } from "./client"

const CHAT_QUEUE = "chat"

export async function pushMessage(payload:any){
    try {
        await redisPublisher.lpush(CHAT_QUEUE,JSON.stringify(payload))
    } catch (error) {
        console.log(error)
    }
}

export async function popMessage(){
    try {
        const result  =  await redisConsumer.brpop(CHAT_QUEUE,0)

        if(!result){
            return null
        }
        
        return JSON.parse(result[1])
    } catch (error) {
        console.log(error)
    }

}