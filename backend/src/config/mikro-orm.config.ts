import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { entities, entityPaths } from './entities.config';

export const getMikroOrmConfig = (configService: ConfigService) => ({
  driver: PostgreSqlDriver,
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  user: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  dbName: configService.get('DB_NAME'),
  entities: entities,
  entitiesTs: entityPaths,
  debug: true,
});
