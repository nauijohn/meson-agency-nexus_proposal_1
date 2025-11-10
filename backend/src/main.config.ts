import passport from "passport";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import {
  JsonWebTokenExceptionFilter,
  TokenExpiredExceptionFilter,
} from "./common/filters";
import { TypeORMErrorExceptionFilter } from "./common/filters/typeorm-error-exception.filter";

export function config(app: INestApplication<any>): void {
  const httpAdapter = app.get(HttpAdapterHost);

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "*",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // app.useGlobalInterceptors(app.get(RequestContextInterceptor));

  app.useGlobalFilters(
    new TokenExpiredExceptionFilter(httpAdapter),
    new JsonWebTokenExceptionFilter(httpAdapter),
    new TypeORMErrorExceptionFilter(httpAdapter),
  );

  app.use(passport.initialize());
}
