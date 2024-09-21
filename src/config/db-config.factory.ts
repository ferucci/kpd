import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class BDConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    try {
      return {
        type: this.configService.get<string>('database.type') as any,
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        username: this.configService.get<string>('database.user'),
        password: this.configService.get<string>('database.password'),
        database: this.configService.get<string>('database.name'),
        entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
        synchronize: true,
        // Колличество подключений к базе
        retryAttempts: 2,
      };
    } catch (error) {
      throw new Error('Method not implemented.');
    }
  }
}
