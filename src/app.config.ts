import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { CommonResponseInterceptor, RootExceptionFilter } from './common';

export async function nestAppConfig<
  T extends INestApplication = INestApplication,
>(app: T) {
  const reflector = app.get<Reflector>(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
}

export function nestResponseConfig<
  T extends INestApplication = INestApplication,
>(app: T, connectSentry = false) {
  app.useGlobalInterceptors(new CommonResponseInterceptor());
  connectSentry
    ? configExceptionFilterWithSentry(app)
    : configFilterStandAlone(app);
}

// Enable Exception Filter stand-alone
function configFilterStandAlone<T extends INestApplication = INestApplication>(
  app: T,
) {
  app.useGlobalFilters(new RootExceptionFilter());
}

// Enalbe Exception Filter with Sentry Connection
function configExceptionFilterWithSentry<
  T extends INestApplication = INestApplication,
>(app: T) {
  // const config = app.get<ConfigService>(ConfigService);
  // Sentry.init({
  //   dsn: config.get<string>('SENTRY_DSN'),
  //   integrations: [nodeProfilingIntegration()],
  //   tracesSampleRate: 1.0,
  //   profilesSampleRate: 1.0,
  // });
  // Sentry.setupNestErrorHandler(app, new RootExceptionFilter());
}
