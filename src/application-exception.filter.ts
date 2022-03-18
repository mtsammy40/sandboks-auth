import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { ApplicationException } from "./commons/application.exception";

@Catch()
export class ApplicationExceptionFilter extends BaseExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof ApplicationException) {
      const ctx = host.switchToHttp();
      const { httpAdapter } = this.httpAdapterHost;

      httpAdapter.reply(ctx.getResponse(), {
        statusCode: exception.error.errorCode.httpStatusCode,
        message: exception.error.displayMessage
      }, exception.error.errorCode.httpStatusCode);
    } else {
      super.catch(exception, host);
    }
  }
}
