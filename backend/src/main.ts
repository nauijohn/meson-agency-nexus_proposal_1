import cookieParser from "cookie-parser";

import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { WsAdapter } from "@nestjs/platform-ws";

import { AppModule } from "./app.module";
import { LoggerService } from "./common/global/logger/logger.service";
import { config } from "./main.config";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useWebSocketAdapter(new WsAdapter(app));

  const env = app.get(ConfigService);
  const PORT = env.getOrThrow<number>("PORT");

  const logger = await app.resolve(LoggerService);

  config(app);

  await app.listen(PORT, () => {
    logger.verbose(`Users service is running on port ${PORT}....`);
  });
}

void bootstrap();
