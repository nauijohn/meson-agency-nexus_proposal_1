import * as Joi from "joi";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { CampaignFlowStepsModule } from "./campaign-flow-steps/campaign-flow-steps.module";
import { CampaignsModule } from "./campaigns/campaigns.module";
import { ClientsModule } from "./clients/clients.module";
import { FlowActivitiesModule } from "./flow-activities/flow-activities.module";
import { FlowStepsModule } from "./flow_steps/flow-steps.module";
import { FlowsModule } from "./flows/flows.module";
import { RefreshTokensModule } from "./refresh-tokens/refresh-tokens.module";
import { TwilioModule } from "./twilio/twilio.mdule";
import { typeOrmConfigFactory } from "./typeorm.config";
import { UserClientsModule } from "./user-clients/user-clients.module";
import { UsersModule } from "./users";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "provision")
          .default("development"),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default("60m"),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().default("7d"),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfigFactory,
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    RefreshTokensModule,
    CampaignsModule,
    TwilioModule,
    ClientsModule,
    UserClientsModule,
    FlowActivitiesModule,
    FlowsModule,
    FlowStepsModule,
    CampaignFlowStepsModule,
  ],
})
export class AppModule {
  onModuleInit() {
    console.log("AppModule initialized");
  }
}
