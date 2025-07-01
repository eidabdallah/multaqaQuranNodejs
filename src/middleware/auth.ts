import jwt from 'jsonwebtoken';
import { ApiError } from './../utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import User from './../models/user.model';
import Role from './../models/role.model';

export const roles = {
    ADMIN: 'Admin',
    STUDENT: 'Student',
    DOCTOR: 'Doctor',
    SUPERVISOR: 'Supervisor',
    CollegeSUPERVISOR: 'CollegeSupervisor',
};

export class Auth {
    static authMiddleware(accessRoles: string[] = []) {
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


                const user = await User.findByPk(decode.id, {
                    attributes: ['id', 'fullName', 'universityId', 'status', 'phoneNumber', 'CollegeName'],
                    include: [{
                        model: Role,
                        attributes: ['name']
                    }]
                });
                if (!user) {
                    return next(new ApiError("المستخدم غير متوفر", 404));
                }
                if (accessRoles.length > 0 && !accessRoles.includes((user as any).Role.name)) {
                    return next(new ApiError("لا يوجد صلاحيات", 403));
                }
                (req as any).user = user;
                next();
            } catch (error: any) {
                return next(new ApiError(error.message || error.stack, 500));
            }
        }
    };
}

