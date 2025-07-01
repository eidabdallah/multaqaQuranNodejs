import { Optional } from 'sequelize';
import { UserAttributes } from './user.interface';

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'confirmEmail' | 'status'> {}
