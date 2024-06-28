import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    console.log(status);
    const pathMessage = this.logger.error(
      `${request.method}  ${request.originalUrl} Has Obtained An Error `,
    );
    const errorDetails = exception.getResponse();

    response.status(exception.getStatus()).json({
      name: new Date().toISOString(),
      pathMessage: pathMessage,
      errorDetails: errorDetails,
    });
  }
}
