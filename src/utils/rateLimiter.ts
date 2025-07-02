import { rateLimit } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

export default class RateLimiterMiddleware {
    static RateLimiter	 = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100, 
        handler: (req: Request, res: Response, next: NextFunction, options: any) => {
            return res.status(429).json({
                success: false,
                message: 'طلب كثير، حاول لاحقًا'
            });
        }
    });
}
