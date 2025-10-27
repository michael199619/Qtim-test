import { config } from 'dotenv';
import path from 'path';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../modules/config/config';
import { User } from './entities';

config()

const database=databaseConfig();

export const AppDataSource=new DataSource({
    ...database,
    type: 'postgres',
    entities: [User],
    migrations: [path.join(__dirname,'../migrations/*.ts')],
    synchronize: false,
});