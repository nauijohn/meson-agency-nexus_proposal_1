import { join } from "path";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isDev = configService.get<string>("NODE_ENV") === "development";

  return {
    type: "postgres",
    host: configService.get("DB_HOST"),
    port: +configService.get("DB_PORT"),
    username: configService.get("DB_USERNAME"),
    password: configService.get("DB_PASSWORD"),
    database: configService.get("DB_DATABASE"),
    entities: [join(__dirname, "**", "*.entity.{ts,js}")],
    namingStrategy: new SnakeNamingStrategy(),
    // subscribers: [__dirname + "/**/*.subscriber{.ts,.js}"],
    synchronize: isDev,
    autoLoadEntities: isDev,
    dropSchema: false,
    ssl: {
      rejectUnauthorized: false, // or true if you import the cert
    },
  };
};
