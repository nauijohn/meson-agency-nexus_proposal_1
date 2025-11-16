import { ForbiddenError } from "@casl/ability";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(ForbiddenError)
export class CaslForbiddenExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: ForbiddenError<any>, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const path = `${httpAdapter.getRequestUrl(ctx.getRequest())}`;
    const httpStatus = HttpStatus.FORBIDDEN;
    const responseBody = {
      message: exception.message ?? "Internal Server Error",
      path,
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
