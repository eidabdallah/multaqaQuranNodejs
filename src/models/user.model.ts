import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import { UserAttributes } from '../interface/user/user.interface';
import { UserCreationAttributes } from '../interface/user/userCreation.interface';
import passwordResetCode from './passwordResetCode.model';

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public universityId!: string;
    public fullName!: string;
    public password!: string;
    public phoneNumber!: string;
    public CollegeName!: string;
    public confirmEmail!: boolean;
    public halaqaId?: number | null | undefined;
    public status!: 'Active' | 'No_Active';
    public gender!: 'Male' | 'Female';
    public role!: 'Admin' | 'TasmeaHifzSupervisor' | 'TasmeaSupervisor' |'Doctor' | 'Student' | 'CollegeSupervisor';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    universityId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    CollegeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    confirmEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'No_Active'),
        defaultValue: 'No_Active',
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female'),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('Admin' , 'TasmeaHifzSupervisor' , 'TasmeaSupervisor' , 'Doctor' , 'Student' , 'CollegeSupervisor'),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
});

User.hasOne(passwordResetCode, { onDelete: 'CASCADE' });
passwordResetCode.belongsTo(User, { onDelete: 'CASCADE' });


export default User;
