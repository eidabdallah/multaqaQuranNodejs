import User from './../models/user.model';
import { IStudentDailyFollowUp } from './../interface/StudentDailyFollowUp/StudentDailyFollowUp.interface';
import { StudentDailyFollowUpCreationAttributes } from './../interface/StudentDailyFollowUp/StudentDailyFollowUpCreation';
import StudentDailyFollowUp from './../models/StudentDailyFollowUp.model';
import { cache } from './../utils/cache';
import { semesterOrder, getSemesterInfo, buildSemesterDateRange } from '../utils/getSemesterInfo';
import { Op } from 'sequelize';
import Halaqa from './../models/halaqa.model';
import Exam from './../models/exam.model';
export default class StudentDailyFollowUpService {
    async checkStudent(studentId: number): Promise<User | null> {
        let user = cache.get<User>(`user_${studentId}`) || null;
        if (user) return user;

        user = await User.findByPk(studentId);
        if (user) {
            cache.set(`user_${studentId}`, user);
        }
        return user;
    }
    async createDailyFollowUp(dailyFollowUp: StudentDailyFollowUpCreationAttributes): Promise<IStudentDailyFollowUp | null> {
        return await StudentDailyFollowUp.create(dailyFollowUp);
    }
    async updateDailyFollowUp(dailyFollowUpData: IStudentDailyFollowUp, id: number): Promise<number> {
        const [affectedRows] = await StudentDailyFollowUp.update(dailyFollowUpData, { where: { id } });
        return affectedRows;
    }
    async deleteDailyFollowUp(id: number): Promise<number> {
        const affectedRows = await StudentDailyFollowUp.destroy({ where: { id } });
        cache.del(`dailyFollowUp_${id}`);

        return affectedRows;
    }
    async getStudentFollowUps(userId: number, currentSemesterOnly: boolean = false) {
        const cacheKey = `dailyFollowUp_${userId}`;
        let followUps = cache.get<IStudentDailyFollowUp[]>(cacheKey);
        if (!followUps) {
            followUps = await StudentDailyFollowUp.findAll({
                where: { userId },
                order: [['date', 'DESC']],
            });

            if (followUps.length > 0) {
                cache.set(cacheKey, followUps);
            }
        }

        if (!currentSemesterOnly) {
            return followUps;
        }
        const currentDate = new Date();
        const { semester, semesterYear } = getSemesterInfo(currentDate);

        const currentSemesterFollowUps = followUps.filter(item => {
            const itemSemesterInfo = getSemesterInfo(new Date(item.date));
            return (
                itemSemesterInfo.semester === semester &&
                itemSemesterInfo.semesterYear === semesterYear
            );
        });
        return {
            semesterInfo: {
                message: `${semester} ${semesterYear}`,
                followUps: currentSemesterFollowUps
            }
        }
    }
    private groupFollowUpsBySemester(followUps: any[]) {
        const grouped: { [key: string]: any[] } = {};

        followUps.forEach(item => {
            const { semester, semesterYear } = getSemesterInfo(new Date(item.date));
            const key = `${semester} ${semesterYear}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(item);
        });
        return grouped;
    }
    private sortGroupedFollowUps(grouped: { [key: string]: any[] }) {
        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            const [semesterA, yearA] = a.split(' ');
            const [semesterB, yearB] = b.split(' ');

            if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
            return semesterOrder(semesterB) - semesterOrder(semesterA);
        });
        return sortedKeys.map(key => ({
            semester: key,
            followUps: grouped[key]
        }));
    }
    async getDailyFollowUpForStudent(userId: number): Promise<any> {
        const followUpsResult = await this.getStudentFollowUps(userId);
        const followUps = Array.isArray(followUpsResult) ? followUpsResult : followUpsResult.semesterInfo?.followUps || [];
        const grouped = this.groupFollowUpsBySemester(followUps);
        const sortedResult = this.sortGroupedFollowUps(grouped);
        return sortedResult;
    }
    private buildIncludeClause(college?: string, halaqaName?: string, gender?: string) {
        const include: any[] = [];
        if (college || halaqaName || gender) {
            const userInclude: any = {
                model: User,
                as: 'user',
                where: {},
                attributes: [],
                include: []
            };
            if (college) userInclude.where.CollegeName = college;
            const halaqaWhere: any = {};
            if (halaqaName) halaqaWhere.halaqaName = halaqaName;
            if (gender) halaqaWhere.gender = gender;

            if (halaqaName || gender) {
                userInclude.include.push({
                    model: Halaqa,
                    as: 'Halaqa',
                    where: halaqaWhere,
                    attributes: []
                });
            }
            include.push(userInclude);
        }
        return include;
    }
    private calculatePages(followUps: StudentDailyFollowUp[]) {
        let totalSavedPages = 0;
        let totalReviewPages = 0;
        followUps.forEach(item => {
            totalSavedPages += item.pageNumberSaved || 0;
            totalReviewPages += item.pageNumberReview || 0;
        });
        return { totalSavedPages, totalReviewPages };
    }
    private buildWhereClause() {
        const today = new Date();
        const { semester, semesterYear } = getSemesterInfo(today);
        const dateFilter = buildSemesterDateRange(semester, semesterYear);
        const where = dateFilter ? { date: dateFilter } : {};
        return { where, semester, semesterYear };
    }
    private async getExamCount(college?: string, halaqaName?: string, gender?: string): Promise<number> {
        const examInclude: any[] = [
            {
                model: User,
                as: 'student',
                where: {},
                include: []
            }
        ];
        if (college) examInclude[0].where.CollegeName = college;
        if (halaqaName || gender) {
            const halaqaWhere: any = {};
            if (halaqaName) halaqaWhere.halaqaName = halaqaName;
            if (gender) halaqaWhere.gender = gender;
            examInclude[0].include.push({
                model: Halaqa,
                as: 'Halaqa',
                where: halaqaWhere,
                attributes: []
            });
        }
        return await Exam.count({
            where: { grade: { [Op.not]: null } },
            include: examInclude
        });
    }
    async getStatistics(filters: { college?: string, halaqaName?: string, gender?: string }) {
        const { college, halaqaName, gender } = filters;
        const dataWhere = this.buildWhereClause();
        const include = this.buildIncludeClause(college, halaqaName, gender);
        const followUps = await StudentDailyFollowUp.findAll({
            where: dataWhere.where,
            include,
            attributes: ['pageNumberSaved', 'pageNumberReview'],
        });
        const { totalSavedPages, totalReviewPages } = this.calculatePages(followUps);
        const examCount = await this.getExamCount(college, halaqaName, gender);
        return {
            message: `إحصائيات ${dataWhere.semester} ${dataWhere.semesterYear}`,
            totalSavedPages,
            totalReviewPages,
            examCount
        };
    }

}