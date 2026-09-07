import { redisClient } from "../../config/redis.js";

const MAX_FAILED_ATTEMPTS = 5;
const FAILURE_WINDOW_SECONDS = 15 * 60;
const LOCK_DURATION_SECONDS = 15 * 60;

class AuthBruteForceService {
    private getFailureKey(email: string): string {
        return `auth:login-failures:${email}`;
    }

    private getLockKey(email: string): string {
        return `auth:login-lock:${email}`;
    }

    async isLocked(email: string): Promise<boolean> {
        const key = this.getLockKey(email);

        const result = await redisClient.exists(key);

        return result === 1;
    }

    async recordFailedAttempt(email: string): Promise<void> {
        const failureKey = this.getFailureKey(email);
        const lockKey = this.getLockKey(email);

        const attempts = await redisClient.incr(failureKey);

        if (attempts === 1) {
            await redisClient.expire(
                failureKey,
                FAILURE_WINDOW_SECONDS,
            );
        }

        if (attempts >= MAX_FAILED_ATTEMPTS) {
            await redisClient.set(
                lockKey,
                "1",
                {
                    EX: LOCK_DURATION_SECONDS,
                },
            );
        }
    }

    async clearFailedAttempts(email: string): Promise<void> {
        const failureKey = this.getFailureKey(email);

        await redisClient.del(failureKey);
    }
}

export const authBruteForceService =
    new AuthBruteForceService();