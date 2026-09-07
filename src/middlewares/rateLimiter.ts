import RedisStore from "rate-limit-redis";
import { redisClient } from "../config/redis.js";
import rateLimit from "express-rate-limit";


const redisStore = new RedisStore({
    sendCommand:async (...args:string[]):Promise<any>=>{
        return redisClient.sendCommand(args)
    }
})

export const globalRateLimiter = rateLimit({
    windowMs:15*60*100,
    limit:300,
    standardHeaders:"draft-8",
    legacyHeaders:false,
    store:redisStore,
    message:{
        success:false,
        message:"Too many requests,Please try again later."
    }

})


export const authRateLimiter=rateLimit({
    windowMs:15*60*1000,
    limit:20,
    standardHeaders:"draft-8",
    legacyHeaders:false,
    store:redisStore,
    message:{
        success:false,
        message:"Too many authentication requests.Please try again later."
    }
})
export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 10,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    store: redisStore,

    message: {
        success: false,
        message: "Too many login attempts. Please try again later.",
    },
});

export const passwordResetRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 5,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    store: redisStore,

    message: {
        success: false,
        message: "Too many password reset requests. Please try again later.",
    },
});

export const verificationRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 5,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    store: redisStore,

    message: {
        success: false,
        message: "Too many verification requests. Please try again later.",
    },
});