import { createClient } from "redis"
import { env } from "./env.js"

export const redisClient = createClient({
  url: env.redis.url,
})

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error)
})

redisClient.on("connect", () => {
  console.log("Redis Client connected")
})

export const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect()
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error)
    throw error
  }
}

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient.isOpen) {
    redisClient.destroy()
  }
}