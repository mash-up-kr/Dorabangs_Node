export class DiscordWebhookProvider {
  protected readonly webhookUrl: string;
  constructor() {}

  public async send(url: string, content: string) {
    await fetch(url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  }
}
