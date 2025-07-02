import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { UserAttributes } from '../interface/user/user.interface';
import { UserCreationAttributes } from '../interface/user/userCreation.interface';

export default class AuthService {
  async checkUniversityId(id: string): Promise<User | null> {
    return await User.findOne({ where: { universityId: id } ,  attributes: ['id', 'universityId', 'password', 'confirmEmail', 'status'] }); 
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
}