import { cache } from '../utils/cache';
import Halaqa from './../models/halaqa.model';
import User from './../models/user.model';
import { HalaqaAttributes } from './../interface/halaqa/halaqa.interface';
import sequelize, { Op } from 'sequelize';
import { Roles } from '../utils/enum/role.enum';

export default class HalaqaService {
    async checkHalaqaName(halaqaName: string): Promise<Halaqa | null> {
        return await Halaqa.findOne({ where: { halaqaName } });
    }
    async createHalaqa(halaqaData: HalaqaAttributes): Promise<Halaqa> {
        return await Halaqa.create(halaqaData);
    }
    async checkSupervisorId(supervisorId: number, attributes: string[]): Promise<User | null> {
        let user: User | null | undefined = cache.get<User>(`user_${supervisorId}`);
        if (user)
            return user;
        return await User.findByPk(supervisorId, { attributes: attributes.length > 0 ? attributes : ['id'] });
    }
    async getHalaqatByCollege(CollegeName: string, gender: string): Promise<Halaqa[] | null> {
        return await Halaqa.findAll({
            where: { CollegeName, gender },
            attributes: ['id', 'halaqaName', 'CollegeName', 'gender', [sequelize.fn('COUNT', sequelize.col('Students.id')), 'studentsCount']],
            include: [{
                model: User,
                as: 'Supervisor',
                attributes: ['id', 'fullName'],
            },
            {
                model: User,
                as: 'Students',
                attributes: [],
            }
            ],
            group: ['Halaqa.id', 'Supervisor.id']
        });

    }
    async getHalaqaById(id: number): Promise<Halaqa | null> {
        return await Halaqa.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'Supervisor',
                    attributes: ['id', 'fullName', 'phoneNumber']
                },
                {
                    model: User,
                    as: 'Students',
                    attributes: ['id', 'fullName', 'phoneNumber']
                }
            ]
        });
    }
    async checkHalaqa(id: number): Promise<Halaqa | null> {
        return await Halaqa.findByPk(id);
    }
    async checkStudent(studentId: number): Promise<User | null> {
        return await User.findByPk(studentId);
    }
    async deleteHalaqa(id: number) {
        await User.update({ halaqaId: null }, { where: { halaqaId: id } });
        return await Halaqa.destroy({ where: { id } });
    }
    async getSuperVisorsByCollege(CollegeName: string, gender: string): Promise<User[] | null> {
        return await User.findAll({
            where: {
                CollegeName,
                role: { [Op.in]: ['Supervisor', 'CollegeSupervisor'] },
                gender
            },
            include: [{
                model: Halaqa,
                as: 'SupervisedHalaqa',
                attributes: ['id'],
                required: false
            }],
            having: sequelize.where(sequelize.col('SupervisedHalaqa.id'), null),
            attributes: ['id', 'fullName', 'role', 'gender', 'CollegeName']
        });
    }
    async updateSuperVisorHalaqa(halaqaId: number, supervisorId: number): Promise<number> {
        const [affectedRows] = await Halaqa.update(
            { supervisorId: supervisorId },
            { where: { id: halaqaId } }
        );
        return affectedRows;
    }
    async getStudentsWithoutHalaqa(CollegeName: string, gender: string): Promise<User[] | null> {
        return await User.findAll({
            where: { CollegeName, gender, halaqaId: null },
            attributes: ['id', 'fullName']
        });
    }
    async updateStudentSupervisor(studentId: number, supervisorId: number): Promise<number> {
        const [affectedRows] = await User.update(
            { halaqaId: supervisorId },
            { where: { id: studentId } }
        );
        return affectedRows;
    }

    async allStudentsByCollege(CollegeName: string, gender: string, role?: Roles, search?: string): Promise<User[] | null> {
        const whereCondition: any = { CollegeName, gender };
        if (role) {
            whereCondition.role = role;
        }
        if (search) {
            whereCondition.fullName = { [Op.like]: `%${search}%` };
        }
        return await User.findAll({ where: whereCondition  , attributes: ['id', 'fullName', 'role', 'gender', 'CollegeName'] });
    }
    async deleteUserFromHalaqa(studentId: number): Promise<number> {
        const [affectedRows] = await User.update(
            { halaqaId: null },
            { where: { id: studentId } }
        );
        return affectedRows;
    }
}