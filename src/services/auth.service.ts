import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { UserAttributes } from '../interface/user/user.interface';
import { UserCreationAttributes } from '../interface/user/userCreation.interface';
import passwordResetCode from './../models/passwordResetCode.model';
import { cache } from './../utils/cache';

export default class AuthService {
  async checkUniversityId(id: string, attributes: string[] = []): Promise<User | null> {
    return await User.findOne({
        where: { universityId: id },
        attributes: attributes.length > 0 ? attributes : ['id']
    });
}
  async create(userData: UserCreationAttributes): Promise<UserAttributes> {
    userData.password = await bcrypt.hash(userData.password, +process.env.SALT_ROUNDS!);
    userData.role = "Student";
    const newUser = await User.create(userData);
    return newUser;
  }

   async findUserPasswordById(userId: number): Promise<User | null> {
    return User.findByPk(userId, { attributes: ['id', 'password'] });
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, +process.env.SALT_ROUNDS!);
  }
  async SaveCode(id: number, code: string) {
    await passwordResetCode.create({ UserId : id, code });
  }
  async checkCode(id: number, code: string) {
    return await passwordResetCode.findOne({ where: { UserId: id, code } });
  }
  async deleteCode(id: number, code: string) {
    await passwordResetCode.destroy({ where: { UserId: id, code } });
  }
}