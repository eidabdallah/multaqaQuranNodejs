import { Request, Response, NextFunction } from 'express';
import { ApiError } from './../../utils/ApiError';
import ExamRequestService from './../../services/examRequest.service';

export default class ExamRequestController {
    constructor(private examRequestService: ExamRequestService) { }
    createExamRequest = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const supervisorId = await this.examRequestService.getSupervisorByHalaqa(user.halaqaId);
        req.body.SupervisorId = supervisorId;
        req.body.StudentId = user.id;
        const examRequest = await this.examRequestService.createExamRequest(req.body);
        if (!examRequest) {
            return next(new ApiError("لم يتم انشاء الطلب", 400));
        }
        return res.status(200).json({ message: "تم انشاء الطلب بنجاح", examRequest });
    }
    getExamRequestsByStudent = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const examRequests = await this.examRequestService.getExamRequestsByStudent(parseInt(user.id));
        if (!examRequests || examRequests.length === 0) {
            return next(new ApiError("لم يتم العثور على الطلبات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الطلبات", examRequests });
    }
    //  get all request exam by supervisor for his students  
    getExamRequestsBySupervisor = async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const examRequests = await this.examRequestService.getExamRequestsBySupervisor(parseInt(user.id));
        if (!examRequests || examRequests.length === 0) {
            return next(new ApiError("لم يتم العثور على الطلبات", 400));
        }
        return res.status(200).json({ message: "تم العثور على الطلبات", examRequests });
    }
    changeStatusExamRequest = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status } = req.body;
        const getExamRequest = await this.examRequestService.getExamRequestById(parseInt(id));
        if (!getExamRequest) {
            return next(new ApiError("لم يتم العثور على الطلب", 400));
        }
        await this.examRequestService.changeStatusExamRequest(parseInt(id), status , getExamRequest);
        return res.status(200).json({ message: "تم تغيير حالة الطلب بنجاح"});
    }
}

