import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'kpd',
  entities: ['src/**/**.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});