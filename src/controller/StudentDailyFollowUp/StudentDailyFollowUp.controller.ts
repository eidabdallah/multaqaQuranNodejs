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
    updateDailyFollowUp = async (req: Request, res: Response, next: NextFunction) => {
         const { id } = req.params;

        const allowedFields = ['ReviewInfo', 'date', 'note', 'savedInfo'];
        const updatedData: any = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updatedData[field] = req.body[field];
            }
        });
        if (Object.keys(updatedData).length === 0) {
            return next(new ApiError("لا يوجد بيانات لتحديثها", 400));
        }
        const affectedRows = await this.DailyFollowUpService.updateDailyFollowUp(updatedData , parseInt(id));
        if (affectedRows === 0) {
            return next(new ApiError("التقييم غير موجود", 404));
        }
        return res.status(200).json({ message: "تم التحديث بنجاح" });
    }
    deleteDailyFollowUp = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const affectedRows = await this.DailyFollowUpService.deleteDailyFollowUp(parseInt(id));
        if (affectedRows === 0) {
            return next(new ApiError("التقييم غير موجود", 404));
        }
        return res.status(200).json({ message: "تم الحذف بنجاح" });
    }
    getAllDailyFollowUpForStudent = async (req: Request, res: Response, next: NextFunction) => {
        const id = (req as any).user.id;
        const dailyFollowUp = await this.DailyFollowUpService.getDailyFollowUpForStudent(id);
        if (!dailyFollowUp) {
            return next(new ApiError("لم يتم العثور على التقييم", 400));
        }
        return res.status(200).json({ message: "تم العثور على التقييم", dailyFollowUp });
    }
    getAllDailyFollowUpForSuperVisor = async (req: Request, res: Response, next: NextFunction) => {
       const {id} = req.params;
       const checkStudent = await this.DailyFollowUpService.checkStudent(parseInt(id));
       if (!checkStudent) {
           return next(new ApiError("الطالب غير موجود", 400));
       }
        const dailyFollowUp = await this.DailyFollowUpService.getStudentFollowUps(parseInt(id) , true);
        if (!dailyFollowUp) {
            return next(new ApiError("لم يتم العثور على التقييم", 400));
        }
        return res.status(200).json({ message: "تم العثور على التقييم", dailyFollowUp });
    }
    getStatistics = async (req: Request, res: Response, next: NextFunction) => {
        const { semester, fullName, college, halaqaName , gender} = req.query;

        const statistics = await this.DailyFollowUpService.getStatistics({
            semester: semester as string,
            fullName: fullName as string,
            college: college as string,
            halaqaName: halaqaName as string,
            gender: gender as string 
        });

        return res.status(200).json({ message: "تم استخراج الإحصائيات", statistics });

    }
}

