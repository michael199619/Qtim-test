import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';
import { UsersRepository } from './users/users.repository';

@Module({
  imports: [],
  providers: [
    UsersRepository,
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        try {
          const dataSource=await AppDataSource.initialize();
          console.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          console.log('Error connecting to database');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource,UsersRepository],
})
export class DatabaseModule { }