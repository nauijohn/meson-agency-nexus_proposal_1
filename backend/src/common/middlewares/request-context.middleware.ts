import { NextFunction, Request, Response } from "express";

// common/middleware/request-context.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";

import { RequestContextService } from "../request-context.service";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly contextService: RequestContextService) {}

  use(request: Request, response: Response, next: NextFunction) {
    const header = request.headers["requestId"];
    const url = `[${request.method} ${request.originalUrl}]`;
    const requestId = Array.isArray(header) ? header[0] : (header ?? "");
    this.contextService.run({ requestId, url }, () => {
      next();
    });
  }
}
