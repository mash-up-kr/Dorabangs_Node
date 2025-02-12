import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

class DataSourceConfig {
  private configService: ConfigService;

  constructor() {
    // ConfigModule 초기화 후 ConfigService 인스턴스 생성
    const configModule = ConfigModule.forRoot();
    this.configService = new ConfigService(configModule);
  }

  getConfig(): any {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'linkit1234!'),
      database: this.configService.get<string>('DB_NAME', 'linkit'),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<boolean>('DB_SYNC', false),
      logging: this.configService.get<boolean>('DB_LOGGING', true),
      migrations: ['migrations/*.js'],
      cli: {
        migrationsDir: 'migrations',
      },
    };
  }
}

const dataSourceConfig = new DataSourceConfig();
export const AppDataSource = new DataSource(dataSourceConfig.getConfig());
