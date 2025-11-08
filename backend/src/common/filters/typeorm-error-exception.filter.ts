import { TypeORMError } from "typeorm";

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(TypeORMError)
export class TypeORMErrorExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: TypeORMError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const path = `${httpAdapter.getRequestUrl(ctx.getRequest())}`;
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      message: exception.message ?? "Internal Server Error",
      path,
      timestamp: new Date().toISOString(),
    };

    if (exception.name === "EntityNotFoundError") {
      httpStatus = HttpStatus.NOT_FOUND;
      responseBody.message = "Entity not found";
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
