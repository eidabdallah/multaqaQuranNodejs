import express, { Application, Request, Response } from "express";
import { connectDB } from "./config/DBconnection";
import NotFoundMiddleware from './utils/NotFound';
import ErrorMiddleware from './utils/Error';
import setupMiddlewares from './utils/setupMiddlewares';
import registerCronJobs from './utils/startCronJobs';
import authRoutes from './routes/auth.route'
import userRoutes from './routes/user.route'
import halaqaRoutes from './routes/halaqa.route'
import adminRouter from './routes/admin.route'
import DailyFollowUpRoutes from './routes/DailyFollowUp.route'

export const initApp = (app: Application) => {
    connectDB();
    setupMiddlewares(app);
    registerCronJobs();
    app.use(express.json());
    
    app.get('/', (req: Request, res: Response) => res.json({ message: 'اهلا بك في ملتقى القران الكريم جنة النجاح' }));

    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);
    app.use('/halaqa', halaqaRoutes);
    app.use('/admin' , adminRouter)
    app.use('/dailyFollowUp' , DailyFollowUpRoutes)


    
    app.use(NotFoundMiddleware.notFound);
    app.use(ErrorMiddleware.handle);
}