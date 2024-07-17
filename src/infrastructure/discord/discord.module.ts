import { Module } from '@nestjs/common';
import { DiscordWebhookProvider } from './discord-webhook.provider';

@Module({
  providers: [DiscordWebhookProvider],
  exports: [DiscordWebhookProvider],
})
export class DiscordModule {}
