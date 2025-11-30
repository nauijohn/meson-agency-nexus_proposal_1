import { classes } from "automapper-classes";
import { CamelCaseNamingConvention } from "automapper-core";
import { AutomapperModule } from "automapper-nestjs";
import * as Joi from "joi";
import { ClsModule } from "nestjs-cls";
import * as uuid from "uuid";

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { AbilitiesGuard } from "./auth/guards/abilities.guard";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { RolesGuard } from "./auth/guards/roles.guard";
import { CampaignFlowStepsModule } from "./campaign-flow-steps/campaign-flow-steps.module";
import { CampaignsModule } from "./campaigns/campaigns.module";
import { ClientContactsModule } from "./client-contacts/client-contacts.module";
import { ClientsModule } from "./clients/clients.module";
import { LoggerModule } from "./common/global/logger/logger.module";
import { RequestContextInterceptor } from "./common/interceptors/request-context.interceptor";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { RequestIdMiddleware } from "./common/middlewares/request-id.middleware";
import { EmployeeClientsModule } from "./employee-clients/employee-clients.module";
import { EmployeesModule } from "./employees/employees.module";
import { EventsModule } from "./events/events.module";
import { ExperimentsModule } from "./experiments/experiments.module";
import { FlowActivitiesModule } from "./flow-activities/flow-activities.module";
import { FlowStepActivitiesModule } from "./flow-step-activities/flow-step-activities.module";
import { FlowStepsModule } from "./flow_steps/flow-steps.module";
import { FlowsModule } from "./flows/flows.module";
import { RefreshTokensModule } from "./refresh-tokens/refresh-tokens.module";
import { TwilioModule } from "./twilio/twilio.mdule";
import { typeOrmConfigFactory } from "./typeorm.config";
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
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: new CamelCaseNamingConvention(),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        saveRes: true,
        saveReq: true,
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        generateId: true,
        idGenerator: () => {
          return uuid.v4();
        },
        // and use the setup method to
        // provide default store values.
        // setup: (cls, req: Request) => {},
      },
    }),
    LoggerModule,
    EventsModule,
    ExperimentsModule,
    UsersModule,
    AuthModule,
    RefreshTokensModule,
    CampaignsModule,
    TwilioModule,
    ClientsModule,
    EmployeeClientsModule,
    FlowActivitiesModule,
    FlowsModule,
    FlowStepsModule,
    CampaignFlowStepsModule,
    ClientContactsModule,
    EmployeesModule,
    FlowStepActivitiesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
