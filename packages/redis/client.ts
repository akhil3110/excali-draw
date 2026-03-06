import "dotenv/config";


import Redis from "ioredis";

console.log("Redis URL:", process.env.REDIS_URL);
export const redisPublisher = new Redis(process.env.REDIS_URL!);
export const redisConsumer =new Redis(process.env.REDIS_URL!);

