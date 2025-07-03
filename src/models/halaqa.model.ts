import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import User from './user.model';
import { HalaqaAttributes } from './../interface/halaqa/halaqa.interface';
import { HalaqaCreationAttributes } from './../interface/halaqa/halaqaCreation.interface';

class Halaqa extends Model<HalaqaAttributes, HalaqaCreationAttributes> implements HalaqaAttributes {
    public id!: number;
    public halaqaName!: string;
    public supervisorId!: number;
    public CollegeName!: string;
    public gender!: 'Male' | 'Female';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Halaqa.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    halaqaName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    CollegeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    supervisorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
     gender: {
        type: DataTypes.ENUM('Male', 'Female'),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'halaqa',
    timestamps: true,
});

Halaqa.hasMany(User, { foreignKey: 'halaqaId', as: 'Students' });
User.belongsTo(Halaqa, { foreignKey: 'halaqaId', as: 'Halaqa' });

Halaqa.belongsTo(User, { foreignKey: 'supervisorId', as: 'Supervisor' });
User.hasOne(Halaqa, { foreignKey: 'supervisorId', as: 'SupervisedHalaqa' });

export default Halaqa;
