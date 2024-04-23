import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function nestSwaggerConfig<
  T extends INestApplication = INestApplication,
>(app: T) {
  const config = new DocumentBuilder();
  config
    .setTitle('Dorabangs API')
    .setDescription('Dorabangs API 입니다')
    .setVersion('1.0.0')
    .setContact(
      'Dorabangs Node.js Team',
      'https://github.com/mash-up-kr/Dorabangs-Node',
      'some@email.com',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
  });
}
