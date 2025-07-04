import { Request, Response, NextFunction } from 'express';
import { ApiError } from './../../utils/ApiError';
import StudentDailyFollowUpService from './../../services/StudentDailyFollowUp.service';


export default class StudentDailyFollowUpController {
    constructor(private DailyFollowUpService: StudentDailyFollowUpService) { }

    createDailyFollowUp = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.body;
        const checkStudent = await this.DailyFollowUpService.checkStudent(parseInt(userId));
        if (!checkStudent) {
            return next(new ApiError("الطالب غير موجود", 400));
        }
        const dailyFollowUp = await this.DailyFollowUpService.createDailyFollowUp(req.body);
        if (!dailyFollowUp) {
            return next(new ApiError("لم يتم انشاء التقييم", 400));
        }
        return res.status(200).json({ message: "تم انشاء التقييم بنجاح", dailyFollowUp });
    }
   
}