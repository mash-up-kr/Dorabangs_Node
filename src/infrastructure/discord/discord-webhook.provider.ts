import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordWebhookProvider {
  constructor(private readonly configService: ConfigService) {}

  public async send(content: string) {
    const discordWebhook = this.configService.get('DISCORD_WEBHOOK_URL');

    await fetch(discordWebhook, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  }
}
