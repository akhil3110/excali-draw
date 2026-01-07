import "dotenv/config";


import Redis from "ioredis";

console.log("redis_db_url", process.env.REDIS_DB_URL! )

export const redisPublisher = new Redis();



export const redisConsumer = new Redis();

