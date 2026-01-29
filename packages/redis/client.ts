import "dotenv/config";


import Redis from "ioredis";

console.log("Redis", process.env.REDIS_HOST, process.env.REDIS_PORT);

export const redisPublisher = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});

export const redisConsumer =new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});

