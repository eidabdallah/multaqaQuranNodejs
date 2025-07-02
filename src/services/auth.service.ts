import User from '../models/user.model';
import Role from '../models/role.model';
import bcrypt from 'bcryptjs';
import { UserAttributes } from '../interface/user/user.interface';
import { UserCreationAttributes } from '../interface/user/userCreation.interface';
import { cache } from '../utils/cache';

export default class AuthService {
  async checkUniversityId(id: string): Promise<User | null> {
    const cacheKey = `user-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached as User;

    const user = await User.findOne({ where: { universityId: id } });
    if (user) cache.set(cacheKey, user);
    return user;
  }

  async create(userData: UserCreationAttributes): Promise<UserAttributes> {
    userData.password = await bcrypt.hash(userData.password, +process.env.SALT_ROUNDS!);
    const newUser = await User.create(userData);
    await Role.create({ name: 'Student', userId: newUser.id });
    return newUser;
  }

  async getByUniversityIdFromDB(id: string): Promise<User | null> {
    return await User.findOne({ where: { universityId: id } });
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, +process.env.SALT_ROUNDS!);
  }
}