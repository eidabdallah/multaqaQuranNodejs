import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { cache } from '../utils/cache';

export class AuthMiddleware {
  static authorize(accessRoles: string[] = []) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARERKEY as string)) {
          return next(new ApiError("التوكن غير متوفر", 401));
        }

        const token = authorization.split(process.env.BEARERKEY as string)[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET_LOGIN as string) as any;

        if (!decode) {
          return next(new ApiError("التوكن غير متوفر", 401));
        }

        const cacheKey = `user_${decode.id}`;
        let user: User | null | undefined = cache.get<User>(cacheKey);

        if (!user) {
          user = await User.findByPk(decode.id, {
            attributes: ['id', 'fullName', 'universityId', 'phoneNumber', 'CollegeName', 'role'],
          });

          if (!user) {
            return next(new ApiError("المستخدم غير متوفر", 404));
          }

          cache.set(cacheKey, user);
        }

        if (accessRoles.length > 0 && !accessRoles.includes(user.role)) {
          return next(new ApiError("لا يوجد صلاحيات", 403));
        }

        (req as any).user = user;
        next();

      } catch (error: any) {
        return next(new ApiError(error.message || error.stack, 500));
      }
    };
  }
}
