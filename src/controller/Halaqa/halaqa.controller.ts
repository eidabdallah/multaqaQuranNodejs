import { Request, Response, NextFunction } from 'express';
import { ApiError } from './../../utils/ApiError';
import HalaqaService from './../../services/halaqa.service';
import { Roles } from '../../utils/enum/role.enum';


export default class HalaqaController {
    constructor(private halaqaService: HalaqaService) { }
// بعد ما جبت الطلاب ، بدي اكبس على الطالب اجيب الاحصائيات تاعونو 

    createHalaqa = async (req: Request, res: Response, next: NextFunction) => {
        const { halaqaName, supervisorId} = req.body;
        const checkHalaqaName = await this.halaqaService.checkHalaqaName(halaqaName);
        if (checkHalaqaName) {
            return next(new ApiError("اسم الحلقة مستخدم", 400));
        }
        const checkSupervisor = await this.halaqaService.checkSupervisorId(supervisorId, ['id', 'role']);
        if (!checkSupervisor) {
            return next(new ApiError("المشرف غير موجود", 400));
        }
        if (checkSupervisor.role !== "Supervisor" && checkSupervisor.role !== "CollegeSupervisor") {
            return next(new ApiError("ليش مشرفا", 400));
        }
        const halaqa = await this.halaqaService.createHalaqa(req.body);
        if (!halaqa) {
            return next(new ApiError("لم يتم انشاء الحلقة", 400));
        }
        return res.status(200).json({ message: "تم انشاء الحلقة بنجاح", halaqa });
    };
    getHalaqatByCollege = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const halaqat = await this.halaqaService.getHalaqatByCollege(user.CollegeName , user.gender);
        if (!halaqat) {
            return next(new ApiError("لم يتم العثور على الحلقات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الحلقات", halaqat });
    }
    getHalaqaById = async (req: Request, res: Response, next: NextFunction) => {
        const { halaqaId } = req.params;
        const halaqa = await this.halaqaService.getHalaqaById(parseInt(halaqaId));
        if (!halaqa) {
            return next(new ApiError("لم يتم العثور على الحلقة", 400));
        }
        return res.status(200).json({ message: "تم العثور على الحلقة", halaqa });
    }
    deleteHalaqa = async (req: Request, res: Response, next: NextFunction) => {
        const { halaqaId } = req.params;
        const checkHalaqaExist = await this.halaqaService.checkHalaqa(parseInt(halaqaId));
        if (!checkHalaqaExist) {
            return next(new ApiError("الحلقة غير موجودة", 400));
        }
        const affectedRows = await this.halaqaService.deleteHalaqa(parseInt(halaqaId));
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم حذف الحلقة", 400));
        }
        return res.status(200).json({ message: "تم حذف الحلقة بنجاح" });
    }
    getSuperVisorsByCollege = async (req: Request, res: Response, next: NextFunction) => { 
       //get all supervisors who are not responsible for the halaqa yet
        const user = (req as any).user;
        const superVisors = await this.halaqaService.getSuperVisorsByCollege(user.CollegeName , user.gender);
        if (!superVisors) {
            return next(new ApiError("لم يتم العثور على المشرفين", 400));
        }
        return res.status(200).json({ message: "تم العثور على المشرفين", superVisors });
    }
    updateSuperVisorHalaqa = async (req: Request, res: Response, next: NextFunction) => {
        const { halaqaId , supervisorId } = req.params;
        const checkSupervisor = await this.halaqaService.checkSupervisorId(parseInt(supervisorId), ['id', 'role']);
        if (!checkSupervisor) {
            return next(new ApiError("المشرف غير موجود", 400));
        }
        if (checkSupervisor.role !== "Supervisor" && checkSupervisor.role !== "CollegeSupervisor") {
            return next(new ApiError("ليش مشرفا", 400));
        }
        const affectedRows = await this.halaqaService.updateSuperVisorHalaqa(parseInt(halaqaId), parseInt(supervisorId));
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم تحديث المشرف", 400));
        }
        return res.status(200).json({ message: "تم تحديث المشرف بنجاح" });
    }
    getStudentsWithoutHalaqa = async (req: Request, res: Response, next: NextFunction) => { 
        // fetch all student dont have halaqa
        const user = (req as any).user;
        const students = await this.halaqaService.getStudentsWithoutHalaqa(user.CollegeName , user.gender);
        if (!students) {
            return next(new ApiError("لم يتم العثور على الطلاب", 400));
        }
        return res.status(200).json({ message: "تم العثور على الطلاب", students });
    }
    updateStudentHalaqa = async (req: Request, res: Response, next: NextFunction) => { 
        const { studentId , halaqaId } = req.params;
        const checkHalaqa = await this.halaqaService.checkHalaqa(parseInt(halaqaId));
        if (!checkHalaqa) {
            return next(new ApiError("الحلقة غير موجودة", 400));
        }
        const checkStudent = await this.halaqaService.checkStudent(parseInt(studentId));
        if (!checkStudent) {
            return next(new ApiError("الطالب غير موجود", 400));
        }
        const affectedRows = await this.halaqaService.updateStudentSupervisor(parseInt(studentId), parseInt(halaqaId));
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم تحديث المشرف", 400));
        }
        return res.status(200).json({ message: "تم تحديث المشرف بنجاح" });
    }
    allStudentsByCollege = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const role = req.query.role as Roles;
         const search = req.query.search as string;
        const students = await this.halaqaService.allStudentsByCollege(user.CollegeName , user.gender , role , search);
        if (!students) {
            return next(new ApiError("لم يتم العثور على الطلاب", 400));
        }
        return res.status(200).json({ message: "تم العثور على الطلاب", students });
    }
    deleteUserFromHalaqa = async (req: Request, res: Response, next: NextFunction) => { 
        const { studentId } = req.params;
        const checkStudent = await this.halaqaService.checkStudent(parseInt(studentId));
        if (!checkStudent) {
            return next(new ApiError("الطالب غير موجود", 400));
        }
        const affectedRows = await this.halaqaService.deleteUserFromHalaqa(parseInt(studentId));
        if (affectedRows === 0) {
            return next(new ApiError("لم يتم حذف المستخدم", 400));
        }
        return res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
    }

}

