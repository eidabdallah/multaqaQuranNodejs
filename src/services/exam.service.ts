import { Op } from 'sequelize';
import Exam from '../models/exam.model';
import Halaqa from './../models/halaqa.model';
import User from './../models/user.model';
export default class ExamService {
    async getSupervisorHalaqaId(userId: number): Promise<Halaqa | null> {
        const halaqa = await Halaqa.findOne({ where: { supervisorId: userId }, attributes: ['id', 'CollegeName', 'gender'] });
        if (!halaqa) {
            return null;
        }
        return halaqa;
    }

    async getAllExamsRequest(supervisorHalaqa: Halaqa | null): Promise<Exam[] | null> {
        const includeCondition: any = {
            model: User,
            as: 'student',
            attributes: ['id', 'fullName', 'phoneNumber', 'universityId'],
            where: {}
        };
        if (supervisorHalaqa) {
            includeCondition.where = {
                CollegeName: supervisorHalaqa.CollegeName,
                halaqaId: { [Op.ne]: supervisorHalaqa.id },
                gender: supervisorHalaqa.gender
            };
        }
        const exams = await Exam.findAll({
            where: { grade: null, SupervisorId: null },
            include: [includeCondition]
        });
        return exams;
    }
    async assignExamToSupervisor(examId: number, supervisorId: number): Promise<number> {
        const [affectedRows] = await Exam.update({ SupervisorId: supervisorId }, { where: { id: examId } });
        return affectedRows;
    }
    async getPendingExamsBySupervisor(supervisorId: number): Promise<Exam[] | null> {
        return await Exam.findAll({ 
            where: { grade: null, SupervisorId: supervisorId  },
            attributes : ['id', 'examType', 'timeExam', 'date', 'parts', 'examPattern' , 'grade', 'statusGrade'],
            include: [{ model: User, as: 'student', attributes: ['id', 'fullName', 'phoneNumber', 'universityId'] }] });
    }
    async insertExamGrade(examId: number, grade: number): Promise<number> {
        const statusGrade = grade >= 95 ? 'ناجح' : 'راسب';
        const [affectedRows] = await Exam.update({ grade , statusGrade }, { where: { id: examId } });
        return affectedRows;
    }
    async getStudentExams(id :number) : Promise<Exam[]> {
        return await Exam.findAll({ 
            where: { StudentId: id  },
            attributes : ['id', 'examType', 'timeExam', 'date', 'parts', 'examPattern' , 'grade', 'statusGrade' , 'SupervisorId'],
            include: [{ model: User, as: 'supervisor', attributes: ['fullName'] }]
        });
    }
}