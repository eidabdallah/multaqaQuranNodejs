import { Request, Response, NextFunction } from 'express';
import UserService from './../../services/user.service';
import { ApiError } from './../../utils/ApiError';


export default class UserController {
    constructor(private userService: UserService) { }

    updateInfo = async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user.id;
        const {fullName , phoneNumber} = req.body;
        const checkPhoneNumber = await this.userService.checkPhoneNumber(phoneNumber);
        if(checkPhoneNumber) 
            return next(new ApiError("رقم الهاتف مستخدم", 400));
        const [affectedCount] = await this.userService.updateSerivce(userId, fullName, phoneNumber);
        if(affectedCount === 0) 
            return next(new ApiError("لم يتم تحديث البيانات", 400));

        return res.status(200).json({ message: "تم تحديث البيانات بنجاح" });
    };
    getUserById = async (req: Request, res: Response, next: NextFunction) => { 
        const {userId} = req.params;
        const user = await this.userService.getUserById(parseInt(userId));
        if(!user)
            return next(new ApiError("لم يتم العثور على المستخدم", 400));
        return res.status(200).json({ message: "معلومات المستخدم", user }); 
    }

}