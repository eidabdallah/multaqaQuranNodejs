import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import { UserAttributes } from '../interface/user/user.interface';
import { UserCreationAttributes } from '../interface/user/userCreation.interface';

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public universityId!: string;
    public fullName!: string;
    public password!: string;
    public phoneNumber!: string;
    public CollegeName!: string;
    public confirmEmail!: boolean;
    public status!: 'Active' | 'No_Active';
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
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
});

export default User;
