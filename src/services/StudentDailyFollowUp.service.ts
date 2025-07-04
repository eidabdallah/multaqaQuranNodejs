
import User from './../models/user.model';
import { IStudentDailyFollowUp } from './../interface/StudentDailyFollowUp/StudentDailyFollowUp.interface';
import { StudentDailyFollowUpCreationAttributes } from './../interface/StudentDailyFollowUp/StudentDailyFollowUpCreation';
import StudentDailyFollowUp from './../models/StudentDailyFollowUp.model';
export default class StudentDailyFollowUpService {
    async checkStudent(studentId: number) : Promise<User | null> {
        return await User.findByPk(studentId);
    }
    async createDailyFollowUp(dailyFollowUp: StudentDailyFollowUpCreationAttributes) : Promise<IStudentDailyFollowUp | null> {
        return await StudentDailyFollowUp.create(dailyFollowUp);
    }
   
}