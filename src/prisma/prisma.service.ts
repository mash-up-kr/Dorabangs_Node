// Nest Pacakges
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

// Third-party Packages
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  private logger = new Logger('Prisma ORM');

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    Object.assign(
      this,
      this.$on('query', (event) => {
        this.logger.debug(`Query(${event.duration}ms) - ${event.query}`);
      }),
      this.$on('error', (event) => {
        this.logger.debug(`Error - ${event.message}`);
      }),
      this.$on('warn', (event) => {
        this.logger.debug(`Warn - ${event.message}`);
      }),
    );
  }
}
