import { join } from "path";

import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isDev = configService.get<string>("NODE_ENV") === "development";

  return {
    type: "mysql",
    host: configService.get("DB_HOST"),
    port: +configService.get("DB_PORT"),
    username: configService.get("DB_USERNAME"),
    password: configService.get("DB_PASSWORD"),
    database: configService.get("DB_DATABASE"),
    entities: [join(__dirname, "**", "*.entity.{ts,js}")],
    synchronize: isDev,
    autoLoadEntities: isDev,
  };
};
