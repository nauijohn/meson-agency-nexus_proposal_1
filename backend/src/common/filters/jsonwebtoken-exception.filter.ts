import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { JsonWebTokenError } from "@nestjs/jwt";

@Catch(JsonWebTokenError)
export class JsonWebTokenExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: JsonWebTokenError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const httpStatus = HttpStatus.UNAUTHORIZED;
    const ctx = host.switchToHttp();
    const path = `${httpAdapter.getRequestUrl(ctx.getRequest())}`;

    console.log("From JsonWebTokenExceptionFilter....");

    console.log("exception: ", JSON.stringify(exception));

    const responseBody = {
      message: exception.message ?? "Unauthorized",
      path,
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
