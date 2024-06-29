import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { captureException } from '@sentry/node';
import { Response } from 'express';
import { RootException, createException } from '../error';
import { ExceptionPayload, ICommonResponse } from '../types/type';

@Catch()
export class RootExceptionFilter implements ExceptionFilter {
  private unknownCode = 'Unknown';

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response: Response = context.getResponse<Response>();
    let targetException = exception;
    let responseStatusCode = 500;
    let responseErrorPayload: ExceptionPayload = {
      code: this.unknownCode,
      message: '',
    };

    // If exception is http exception instance
    if (targetException instanceof HttpException) {
      // Response Message
      const response = targetException.getResponse();
      // Response Status Code
      responseStatusCode = targetException.getStatus();
      responseErrorPayload = {
        code: this.unknownCode,
        message: response,
      };
    }
    // Custom Exception
    else if (targetException instanceof RootException) {
      // Response Message
      const response = targetException.payload;
      // Response Status Code
      const statusCode = targetException.statuscode;
      responseErrorPayload = response;
      responseStatusCode = statusCode;
    }
    // Error
    else {
      const errorMessage = targetException.message;
      // Response Status Code
      responseStatusCode = 500;
      // Response Message
      responseErrorPayload = {
        code: this.unknownCode,
        message: errorMessage,
      };
      targetException = new (class extends createException(
        responseStatusCode,
        errorMessage ?? exception.name,
        this.unknownCode,
      ) {})();
    }
    captureException(targetException);
    const exceptionResponse: ICommonResponse = {
      success: false,
      error: responseErrorPayload,
    };

    return response.status(responseStatusCode).json(exceptionResponse);
  }
}
