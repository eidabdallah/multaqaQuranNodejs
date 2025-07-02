import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthService from './../../services/auth.service';
import { ApiError } from './../../utils/ApiError';
import { confirmEmailMessage, sendConfirmEmail } from './../../utils/authTemplete';
import { cache } from './../../utils/cache';

export default class AuthController {
    constructor(private authService: AuthService) { }

    login = async (req: Request, res: Response, next: NextFunction) => {

        const { universityId, password } = req.body;
        const user = await this.authService.checkUniversityId(universityId);
        if (!user) return next(new ApiError("معلومات المستخدم خاطئة", 400));

        const valid = await this.authService.validatePassword(password, user.password);
        if (!valid) return next(new ApiError("معلومات المستخدم خاطئة", 400));

        if (!user.confirmEmail) return next(new ApiError("الرجاء تأكيد الايميل الجامعي", 400));
        if (user.status === "No_Active") return next(new ApiError("لم يتم تفعيل الحساب بعد", 400));

        const token = jwt.sign({ id: user.id, universityId: user.universityId }, process.env.JWT_SECRET_LOGIN!);
        return res.status(200).json({ message: "تم تسجيل الدخول", token });

    };

    register = async (req: Request, res: Response, next: NextFunction) => {

        const { universityId, fullName } = req.body;
        const exists = await this.authService.checkUniversityId(universityId);
        if (exists) return next(new ApiError("الرقم الجامعي مستخدم", 400));

        await this.authService.create(req.body);
        await sendConfirmEmail(universityId, fullName, req);

        return res.status(201).json({ message: "تم إنشاء الحساب، تأكد من بريدك" });

    };

    confirmEmail = async (req: Request, res: Response, next: NextFunction) => {

        const { token } = req.params;
        const payload = jwt.verify(token, process.env.JWT_SECRET_ConfirmEmail!) as { email: string };
        const match = payload.email.match(/^s(\d+)@stu\.najah\.edu$/);
        if (!match) return next(new ApiError("صيغة الإيميل خاطئة", 400));

        const universityId = match[1];
        const user = await this.authService.checkUniversityId(universityId);
        if (!user) return next(new ApiError("المستخدم غير موجود", 404));

        user.confirmEmail = true;
        await user.save();

        confirmEmailMessage(user.fullName, res);

    };

    getUser = async (req: Request, res: Response) => {
        return res.status(200).json({ message: "بيانات المستخدم", user: (req as any).user });
    };

    changePassword = async (req: Request, res: Response, next: NextFunction) => {

        const { universityId, oldPassword, newPassword } = req.body;
        const cachedUser = (req as any).user;

        if (universityId !== cachedUser.universityId) return next(new ApiError("رقم جامعي غير مطابق", 400));

        const user = await this.authService.getByUniversityIdFromDB(universityId);
        if (!user) return next(new ApiError("المستخدم غير موجود", 404));

        const valid = await this.authService.validatePassword(oldPassword, user.password);
        if (!valid) return next(new ApiError("كلمة المرور القديمة خاطئة", 400));

        user.password = await this.authService.hashPassword(newPassword);
        await user.save();

        cache.del(`user-${universityId}`);
        return res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });

    };
}