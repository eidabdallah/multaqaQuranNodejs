import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import Role from '../models/role.model';
import { cache } from '../utils/cache';

export class AuthMiddleware {
    static authorize(allowedRoles: string[] = []) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { authorization } = req.headers;
                if (!authorization?.startsWith(process.env.BEARERKEY as string)) {
                    return next(new ApiError("التوكن غير متوفر", 401));
                }
                const token = authorization.slice((process.env.BEARERKEY as string).length).trim();
                const payload = jwt.verify(token, process.env.JWT_SECRET_LOGIN!) as any;
                if (!payload) {
                    return next(new ApiError("التوكن غير صالح", 401));
                }
                const cacheKey = `user-${payload.universityId}`;
                let user = cache.get(cacheKey);
                if (!user) {
                    const dbUser = await User.findByPk(payload.id, {
                        attributes: ['id', 'fullName', 'universityId', 'status', 'phoneNumber', 'CollegeName', 'password'],
                        include: [{ model: Role, attributes: ['name'] }]
                    });
                    if (!dbUser) return next(new ApiError("المستخدم غير موجود", 404));
                    user = dbUser.toJSON();
                    cache.set(cacheKey, user);
                }
                if (allowedRoles.length && !allowedRoles.includes((user as any).Role.name)) {
                    return next(new ApiError("لا يوجد صلاحيات", 403));
                }
                (req as any).user = user;
                next();
            } catch (err: any) {
                next(new ApiError(err.message || "خطأ غير متوقع", 500));
            }
        };
    }
}