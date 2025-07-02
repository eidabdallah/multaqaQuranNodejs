import cors from 'cors';
import morgan from 'morgan';
import SecurityMiddleware from './security';
import RateLimiterMiddleware from './rateLimiter';
import CompressionMiddleware from './compression';
import { Application } from 'express';

export default function setupMiddlewares(app: Application) {
    app.use(cors());
    app.use(SecurityMiddleware.helmetSecurity);
    app.use(RateLimiterMiddleware.RateLimiter);
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    app.use(CompressionMiddleware.compression);
}
