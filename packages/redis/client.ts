import "dotenv/config";


import Redis from "ioredis";


export const redisPublisher = new Redis(process.env.REDIS_URL!);
export const redisConsumer =new Redis(process.env.REDIS_URL!);

