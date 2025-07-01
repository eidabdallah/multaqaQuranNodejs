import express, { Application, Request, Response } from "express";
import cors from 'cors'
import morgan from "morgan";
import { connectDB } from "./config/DBconnection";
import SecurityMiddleware from "./utils/security";
import RateLimiterMiddleware from './utils/rateLimiter';
import CompressionMiddleware from './utils/compression';
import NotFoundMiddleware from './utils/NotFound';
import ErrorMiddleware from './utils/Error';
import authRoutes from './routes/auth.route'


export const initApp = (app: Application) => {
    connectDB();
    app.use(cors())
    app.use(SecurityMiddleware.helmetSecurity);
    app.use(RateLimiterMiddleware.RateLimiter);
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    app.use(CompressionMiddleware.compression);

    app.use(express.json());
    
    app.get('/', (req: Request, res: Response) => res.json({ message: 'اهلا بك في ملتقى القران الكريم جنة النجاح' }));

    app.use('/auth', authRoutes);
    
    app.use(NotFoundMiddleware.notFound);
    app.use(ErrorMiddleware.handle);
}