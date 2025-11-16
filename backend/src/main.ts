import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { LoggerService } from "./common/global/logger/logger.service";
import { config } from "./main.config";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get(ConfigService);
  const PORT = env.getOrThrow<number>("PORT");

  const logger = await app.resolve(LoggerService);

  config(app);

  await app.listen(PORT, () => {
    logger.verbose(`Users service is running on port ${PORT}...`);
  });
}

void bootstrap();
