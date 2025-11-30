import passport from "passport";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import {
  JsonWebTokenExceptionFilter,
  TokenExpiredExceptionFilter,
} from "./common/filters";
import { CaslForbiddenExceptionFilter } from "./common/filters/casl-forbidden-exception.filter";
import { TypeORMErrorExceptionFilter } from "./common/filters/typeorm-error-exception.filter";

export function config(app: INestApplication<any>): void {
  const httpAdapter = app.get(HttpAdapterHost);

  app.setGlobalPrefix("api");

  // app.enableCors();

  app.enableCors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    // allowedHeaders: "*",
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    exposedHeaders: [
      "Set-Cookie",
      "X-Powered-By",
      "X-Request-Id",
      "X-Total-Count",
      "X-Page",
      "X-Limit",
      "X-Total-Pages",
      "X-Has-Next",
      "X-Has-Previous",
    ],
    origin: "http://localhost:5173", // your React app
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // app.useGlobalInterceptors(app.get(RequestContextInterceptor));

  app.useGlobalFilters(
    new TokenExpiredExceptionFilter(httpAdapter),
    new JsonWebTokenExceptionFilter(httpAdapter),
    new TypeORMErrorExceptionFilter(httpAdapter),
    new CaslForbiddenExceptionFilter(httpAdapter),
  );

  app.use(passport.initialize());
}
