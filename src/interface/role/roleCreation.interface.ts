import { Optional } from 'sequelize';
import { RoleAttributes } from './role.interface';

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}
