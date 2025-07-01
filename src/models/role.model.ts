import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import { RoleAttributes } from './../interface/role/role.interface';
import User from './user.model';
import { RoleCreationAttributes } from '../interface/role/roleCreation.interface';

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: number;
    public name!: 'Admin' | 'Supervisor' | 'Doctor' | 'Student' | 'CollegeSupervisor';
    public userId!: number;
}

Role.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.ENUM('Admin', 'Supervisor' , 'Doctor', 'Student', 'CollegeSupervisor'),
        allowNull: false,
    },
    userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
},
}, {
    sequelize,
    tableName: 'role',
    timestamps: true,
});


Role.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Role, { foreignKey: 'userId' }); 


export default Role;
