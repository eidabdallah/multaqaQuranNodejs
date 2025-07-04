import { Request, Response, NextFunction } from 'express';
import { ApiError } from './../../utils/ApiError';
import AdminService from './../../services/admin.service';


export default class AdminController {
    constructor(private adminService: AdminService) { }

    getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
        const requests = await this.adminService.getAllRequests();
        if (!requests || requests.length === 0) {
            return next(new ApiError("لم يتم العثور على الطلبات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الطلبات", requests });
    }
    acceptRequest = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const checkUser = await this.adminService.checkUser(parseInt(userId));
        if (!checkUser) {
            return next(new ApiError("المستخدم غير موجود", 400));
        }
        const affectedRows = await this.adminService.acceptRequest(parseInt(userId));
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم قبول الطلب", 400));
        }
        return res.status(200).json({ message: "تم قبول الطلب بنجاح" });
    };
}