import { Optional } from 'sequelize';
import { IStudentDailyFollowUp } from './StudentDailyFollowUp.interface';

export interface StudentDailyFollowUpCreationAttributes  extends Optional<IStudentDailyFollowUp, 'id'> {}
