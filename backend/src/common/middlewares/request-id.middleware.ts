import { NextFunction, Request, Response } from "express";
import { ClsService } from "nestjs-cls";

import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}
  use(request: Request, response: Response, next: NextFunction) {
    // request.headers.requestId = uuidv4();
    response.setHeader("X-Request-Id", this.cls.getId());
    next();
  }
}
