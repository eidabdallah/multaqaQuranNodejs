import User from './../models/user.model';
import { cache } from './../utils/cache';
import ExamRequest from './../models/examRequest.model';
import { ExamRequestAttributes } from '../interface/ExamRequest/examRequest.interface';
import Halaqa from './../models/halaqa.model';
import { ExamRequestStatus } from '../utils/enum/ExamRequestStatus';
import Exam from './../models/exam.model';
export default class ExamRequestService {
    async checkStudent(studentId: number): Promise<User | null> {
        let user = cache.get<User>(`user_${studentId}`) || null;
        if (user) return user;

        user = await User.findByPk(studentId);
        if (user) {
            cache.set(`user_${studentId}`, user);
        }
        return user;
    }
    async getSupervisorByHalaqa(halaqaId: number): Promise<number | null> {
        const halaqa = await Halaqa.findByPk(halaqaId, { attributes: ['supervisorId'] });
        if (!halaqa) {
            return null;
        }
        return halaqa.supervisorId;
    }
    async createExamRequest(data: ExamRequestAttributes): Promise<ExamRequestAttributes> {
        return await ExamRequest.create(data);
    }
    async getExamRequestsByStudent(studentId: number): Promise<ExamRequestAttributes[]> {
        return await ExamRequest.findAll({ where: { StudentId: studentId } });
    }
    async getExamRequestsBySupervisor(supervisorId: number): Promise<ExamRequestAttributes[]> {
        return await ExamRequest.findAll({
            where: { SupervisorId: supervisorId },
            attributes: { exclude: ['createdAt', 'updatedAt', 'StudentId'] },
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'fullName']
                }
            ]
        });
    }
    async getExamRequestById(id: number): Promise<ExamRequestAttributes | null> {
        return await ExamRequest.findByPk(id , { attributes: { exclude: ['createdAt', 'updatedAt' , 'SupervisorId' , 'id'] }});
    }
    async changeStatusExamRequest(id: number, status: ExamRequestStatus , examData: ExamRequestAttributes): Promise<any> {
        if (status === ExamRequestStatus.REJECTED) {
            await ExamRequest.destroy({ where: { id } });
        }
        else if (status === ExamRequestStatus.APPROVED) {
            await ExamRequest.destroy({ where: { id } });
            await Exam.create({ StudentId: examData.StudentId ,examType: examData.examType , timeExam: examData.timeExam , date: examData.date , parts: examData.parts , examPattern: examData.examPattern });
        }
    }

}