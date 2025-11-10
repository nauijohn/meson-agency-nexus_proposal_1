import { NextFunction, Request, Response } from "express";

import { Injectable, NestMiddleware } from "@nestjs/common";

import { LoggerService } from "../global/logger/logger.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction) {
    const { ip } = request;
    const userAgent = request.get("user-agent") || "";
    const now = Date.now();

    this.logger.log(
      `\x1b[37mSTART - ${userAgent} ${ip} \x1b[33m${Date.now() - now}ms\x1b[0m`,
    );

    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");

      this.logger.log(
        `\x1b[37mEND ${statusCode} ${contentLength} - ${userAgent} ${ip} \x1b[33m${Date.now() - now}ms\x1b[0m`,
      );
    });

    next();
  }
}
