import { Request, Response, NextFunction } from 'express';
import { ApiError } from './../../utils/ApiError';
import ExamService from './../../services/exam.service';

export default class ExamController {
    constructor(private examService: ExamService) { }
    getAllExamsRequest = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const supervisorHalaqa = await this.examService.getSupervisorHalaqaId(user.id);
        const exams = await this.examService.getAllExamsRequest(supervisorHalaqa);
        if (!exams || exams.length === 0) {
            return next(new ApiError("لم يتم العثور على الامتحانات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الامتحانات", exams });
    }
    getPendingExamsBySupervisor = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const exams = await this.examService.getPendingExamsBySupervisor(user.id);
        if (!exams || exams.length === 0) {
            return next(new ApiError("لم يتم العثور على الامتحانات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الامتحانات", exams });
    }
    assignExamToSupervisor = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const { examId } = req.params;
        const affectedRows = await this.examService.assignExamToSupervisor(parseInt(examId), user.id);
        if (affectedRows === 0) {
            return next(new ApiError("لا يوجد امتحان لهذا الطالب", 400));
        }
        return res.status(200).json({ message: "تم تعيين الامتحان للمشرف بنجاح" });
    }
    insertExamGrade = async (req: Request, res: Response, next: NextFunction) => {
        const { examId, grade } = req.body;
        const affectedRows = await this.examService.insertExamGrade(parseInt(examId), grade);
        if (affectedRows === 0) {
            return next(new ApiError("لا يوجد امتحان لهذا الطالب", 400));
        }
        return res.status(200).json({ message: "تم ادخال العلامة بنجاح" });
    }
    getStudentExam = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const exams = await this.examService.getStudentExams(parseInt(user.id));
        if (!exams || exams.length === 0) {
            return next(new ApiError("لم يتم العثور على الامتحانات", 400));
        }
        const gradedExams = exams.filter(e => e.grade !== null);
        const supervisedExams = exams.filter(e => e.grade === null && e.SupervisorId !== null);
        const unsupervisedExams = exams.filter(e => e.grade === null && e.SupervisorId === null);

        return res.status(200).json({
            message: "تم العثور على الامتحانات",
            exams: [
                {
                    title: "امتحانات يلي تم تقديمها",
                    data: gradedExams
                },
                {
                    title: "بانتظار التقديم (تم اختيارها من مشرف)",
                    data: supervisedExams
                },
                {
                    title: "بانتظار تحديد المشرف",
                    data: unsupervisedExams
                }
            ]
        });
    }
}

