import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import { IStudentDailyFollowUp } from './../interface/StudentDailyFollowUp/StudentDailyFollowUp.interface';
import { StudentDailyFollowUpCreationAttributes } from './../interface/StudentDailyFollowUp/StudentDailyFollowUpCreation';
import User from './user.model';

class StudentDailyFollowUp extends Model< IStudentDailyFollowUp , StudentDailyFollowUpCreationAttributes> implements IStudentDailyFollowUp {
    public id!: number;
    public ReviewInfo!: string;
    public savedInfo!: string;
    public note!: string;
    public date!: Date;
    public userId!: number;
    public pageNumberSaved!: number;
    public pageNumberReview!: number
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

StudentDailyFollowUp.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ReviewInfo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    savedInfo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    pageNumberSaved:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    pageNumberReview:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'StudentDailyFollowUp',
    timestamps: true,
});

StudentDailyFollowUp.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(StudentDailyFollowUp, { foreignKey: 'userId', as: 'dailyFollowUps' });

export default StudentDailyFollowUp;
