import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { config } from "./main.config";

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  config(app);

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Users service is running on port ${process.env.PORT ?? 3000}...`,
    );
  });
}

void bootstrap();
