import User from '../models/user.model';
import { UserAttributes } from '../interface/user/user.interface';
import { UserCreationAttributes } from './../interface/user/userCreation.interface';
import bcrypt from 'bcryptjs';
import 'dotenv/config'
import Role from './../models/role.model';

export default class AuthService {
    async checkUnverisityId(universityId: string): Promise<User | null> {
        const user = await User.findOne({ where: { universityId } });
        return user;
    }
    async create(userData: UserCreationAttributes): Promise<UserAttributes> {
        userData.password = await bcrypt.hash(userData.password, parseInt(process.env.SALT_ROUNDS as string));
        const newUser = await User.create(userData);
        await Role.create({ name: 'Student', userId : newUser.id });
        return newUser;
    }
}
