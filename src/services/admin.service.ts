import { UserAttributes } from '../interface/user/user.interface';
import User from '../models/user.model';
import  bcrypt  from 'bcryptjs';
import { cache } from './../utils/cache';

export default class AdminService {
    async getAllRequests(): Promise<User[] | null> {
        return await User.findAll({
            where: { status: 'No_Active', role: 'Student' },
            attributes: ['id', 'universityId', 'fullName', 'status', 'phoneNumber', 'CollegeName', 'role' , 'confirmEmail']
        });
    }
    async checkUser(id: number): Promise<User | null> {
        let user = cache.get<User>(`user_${id}`) || null;
        if (user) return user;

        user = await User.findByPk(id , { attributes: ['id', 'fullName', 'universityId', 'phoneNumber', 'CollegeName', 'role' , 'gender' , 'halaqaId'],});
        if (user) {
            cache.set(`user_${id}`, user);
        }
        return user;
    }
    async acceptRequest(id: number): Promise<number> {
        const [affectedRows] = await User.update( { status: 'Active' },{ where: { id }});
        return affectedRows;
    }
    async checkUniversity(id: number): Promise<User | null> {
        return await User.findByPk(id);
    }
    async checkPhoneNumber(phoneNumber: string): Promise<User | null> {
        return await User.findOne({ where: { phoneNumber } });
    }
    async createUser(userData: UserAttributes): Promise<User | null> {
        userData.password = await bcrypt.hash(userData.password, +process.env.SALT_ROUNDS!);
        return await User.create({ ...userData, confirmEmail: true , status: 'Active' });
    }
    async changeConfirmEmail(id: number): Promise<number> {
        const [affectedRows] = await User.update({ confirmEmail: true }, { where: { id } });
        return affectedRows;
    }
    async deleteUser(id: number): Promise<number> {
        const affectedRows = await User.destroy({ where: { id } });
        return affectedRows;
    }
}