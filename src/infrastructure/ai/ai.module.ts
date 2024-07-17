import { Module } from '@nestjs/common';
import { DiscordModule } from '../discord/discord.module';
import { AiService } from './ai.service';

@Module({
  imports: [DiscordModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
