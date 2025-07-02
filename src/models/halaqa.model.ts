import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';
import User from './user.model';

class Halaqa extends Model {
    public id!: number;
    public halaqaName!: string;
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
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'halaqa',
    timestamps: true,
});

User.belongsTo(Halaqa, { foreignKey: 'halaqaId' });
Halaqa.hasMany(User, { foreignKey: 'halaqaId' });

Halaqa.belongsTo(User, { as: 'supervisor', foreignKey: 'supervisorId' });
User.hasOne(Halaqa, { as: 'supervisedHalaqa', foreignKey: 'supervisorId' });

export default Halaqa;
