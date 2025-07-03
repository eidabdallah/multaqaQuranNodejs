import e from 'express';
import User from '../models/user.model';
import { cache } from '../utils/cache';
import { Roles } from '../utils/enum/role.enum';

export default class UserService {
    async updateSerivce(id:number, fullName: string, phoneNumber: string) {
        return await User.update({ fullName, phoneNumber }, { where: { id } });
    }
    async checkPhoneNumber(phoneNumber: string) : Promise<User | null> {
        return await User.findOne({ where: { phoneNumber } });
    }
    async getUserById(id: number) : Promise<User | null> {
        let user : User | null | undefined = cache.get<User>(`user_${id}`);
        if (user) 
            return user;
        user = await User.findByPk(id , {  attributes: ['id', 'fullName', 'universityId', 'status', 'phoneNumber', 'CollegeName', 'role']});
        cache.set(`user_${id}`, user);
        return user;
    }
    async checkStudent(studentId: number): Promise<User | null> {
        return await User.findByPk(studentId);
    }
    async changeRoleStudent(studentId: number, role: Roles): Promise<number> {
        const [affectedRows] = await User.update({ role }, { where: { id: studentId } });
        return affectedRows;
    }
}