import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './database/entities/client.entity';
import { ClientsModule } from './module/clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql.db',
      entities: [Client],
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: true,
      synchronize: false,
    }),
    ClientsModule,
  ],
})
export class AppModule {}
