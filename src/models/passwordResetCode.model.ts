import { DataTypes, Model } from 'sequelize';
import { sequelize } from './../config/DBconnection';

class passwordResetCode extends Model {
    public id!: number;
    public code!: string;
    public UserId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

passwordResetCode.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        defaultValue: ''
    },

}, {
    sequelize,
    tableName: 'passwordResetCode',
    timestamps: true,
    indexes: [
        {
            unique: false,
            fields: ['UserId', 'code']
        }
    ]
});

export default passwordResetCode;
