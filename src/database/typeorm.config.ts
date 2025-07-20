import { join } from 'path';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'sqlite',
  database: join(__dirname, '..', '..', 'db', 'sql.db'),
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsRun: true,
  synchronize: false,
});
