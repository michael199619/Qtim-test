import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ArticlesRepository } from './articles/articles.repository';
import { AppDataSource } from './data-source';

@Module({
  imports: [],
  providers: [
    ArticlesRepository,
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
  exports: [DataSource,ArticlesRepository],
})
export class DatabaseModule { }