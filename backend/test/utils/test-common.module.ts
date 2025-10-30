import * as Joi from "joi";
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { EntitySchema, MixedList } from "typeorm";

// test/test-common.module.ts
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({})
export class TestCommonModule {
  static forRoot(
    entities?: MixedList<string | Function | EntitySchema<any>>,
  ): DynamicModule {
    return {
      module: TestCommonModule,
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities,
          synchronize: true,
          dropSchema: true,
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: Joi.object({
            NODE_ENV: Joi.string().valid("test").default("test"),
            JWT_SECRET: Joi.string().required(),
            JWT_EXPIRES_IN: Joi.string().default("60m"),
            JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
            JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().default("7d"),
          }),
        }),
      ],
      exports: [TypeOrmModule, ConfigModule],
    };
  }
}
