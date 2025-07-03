import { Optional } from 'sequelize';
import { HalaqaAttributes } from './halaqa.interface';

export interface HalaqaCreationAttributes extends Optional<HalaqaAttributes,'id'> {}
