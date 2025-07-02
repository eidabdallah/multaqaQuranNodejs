import express, { Application, Request, Response } from "express";
import { connectDB } from "./config/DBconnection";
import NotFoundMiddleware from './utils/NotFound';
import ErrorMiddleware from './utils/Error';
import authRoutes from './routes/auth.route'
import setupMiddlewares from './utils/setupMiddlewares';
import registerCronJobs from './utils/startCronJobs';


export const initApp = (app: Application) => {
    connectDB();
    setupMiddlewares(app);
    registerCronJobs();
    app.use(express.json());
    
    app.get('/', (req: Request, res: Response) => res.json({ message: 'اهلا بك في ملتقى القران الكريم جنة النجاح' }));

    app.use('/auth', authRoutes);
    
    app.use(NotFoundMiddleware.notFound);
    app.use(ErrorMiddleware.handle);
}