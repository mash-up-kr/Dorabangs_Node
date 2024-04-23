// Nest Pacakges
import { Global, Module } from '@nestjs/common';

// Custom Packages
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
