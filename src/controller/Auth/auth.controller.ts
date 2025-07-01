import { NextFunction, Request, Response } from "express";
import AuthService from "../../services/auth.service";
import { ApiError } from "../../utils/ApiError.js";
import { confirmEmailMessage, sendConfirmEmail } from './../../utils/authTemplete';
import  jwt  from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default class AuthController {
    constructor(private authService: AuthService) {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.getUser = this.getUser.bind(this);
        this.confirmEmail = this.confirmEmail.bind(this);
    }
    async login(req: Request, res: Response , next : NextFunction) {
       const userData = req.body;
        const user = await this.authService.checkUnverisityId(userData.universityId);
        if(!user) {
           return next(new ApiError("معلومات المستخدم خاطئة", 400));
        }
        const isPasswordValid = await bcrypt.compare(userData.password, user.password);
        if (!isPasswordValid) {
            return next(new ApiError("معلومات المستخدم خاطئة", 400));
        }
        const secret = process.env.JWT_SECRET_LOGIN as string;
        const token = jwt.sign({ id: user.id, universityId: user.universityId }, secret);
        if(user.status === "No_Active") {
            return next(new ApiError("لم يتم قبول حسابك بعد من قبل المسؤول", 400));
        }
        return res.status(200).json({ message: "تم تسجيل الدخول بنجاح", token  });
    }

    async register(req: Request, res: Response , next : NextFunction) {
        const userData = req.body;
        const user = await this.authService.checkUnverisityId(userData.universityId);
        if(user) {
           return next(new ApiError("رقم الجامعي مستخدم", 400));
        }
        await this.authService.create(userData);
        await sendConfirmEmail(userData.universityId, userData.fullName, req);
        return res.status(201).json({ message: "تم انشاء حساب بنجاح ، الرجاء الدخول الى ايميلك الجامعي للتاكيد" });
    }
    async confirmEmail(req: Request, res: Response, next: NextFunction) {
        const { token } = req.params;
        const secret = process.env.JWT_SECRET_ConfirmEmail as string;
        const decodedToken = jwt.verify(token, secret);
        const email = (decodedToken as { email: string }).email;
        const match = email.match(/^s(\d+)@stu\.najah\.edu$/);

        if (!match) {
            return next(new ApiError("خطا في صيغة الايميل", 400));
        }
        const universityId = match[1];
        const user = await this.authService.checkUnverisityId(universityId);
        if(user){
            user.confirmEmail = true;
            await user.save();
            confirmEmailMessage(user.fullName, res);
        } else {
            return next(new ApiError('المستخدم غير موجود.', 404));
        }
    }
     async getUser(req: Request, res: Response) {
        const user = (req as any).user;
        console.log(user);
        return res.status(200).json({ message: "معلومات المستخدم", user  });
    }
}