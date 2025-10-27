import { config } from 'dotenv';
import path from 'path';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../modules/config/config';
import { Article } from './entities';

config()

const database=databaseConfig();

export const AppDataSource=new DataSource({
    ...database,
    type: 'postgres',
    entities: [Article],
    migrations: [path.join(__dirname,'../migrations/*.ts')],
    synchronize: false,
});