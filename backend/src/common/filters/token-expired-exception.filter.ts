import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { TokenExpiredError } from "@nestjs/jwt";

@Catch(TokenExpiredError)
export class TokenExpiredExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: TokenExpiredError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const httpStatus = HttpStatus.UNAUTHORIZED;
    const ctx = host.switchToHttp();
    const path = `${httpAdapter.getRequestUrl(ctx.getRequest())}`;

    const responseBody = {
      message: exception.message ?? "Unauthorized",
      path,
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
