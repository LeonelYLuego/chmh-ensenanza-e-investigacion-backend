import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpResponse } from '@utils/dtos';

/** @class Catches every exception, filters it and send a specific response to the client */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    // If the exception doesn't have error code, assigns 500 error code (server error)
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Try to get the message, if doesn't have message, the message is the object
    let exceptionMsg: any = exception as any;
    if (exceptionMsg.message !== undefined) exceptionMsg = exceptionMsg.message;

    console.log(exception);

    const responseBody: HttpResponse<void> = {
      error: {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        exception: exceptionMsg,
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, 200);
  }
}
