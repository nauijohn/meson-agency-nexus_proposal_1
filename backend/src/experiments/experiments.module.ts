import { Module } from "@nestjs/common";

import { ExperimentsController } from "./experiments.controller";
import { ExperimentsService } from "./experiments.service";

@Module({
  controllers: [ExperimentsController],
  providers: [
    // {
    //   provide: ExperimentsService,
    //   inject: [REQUEST, LoggerService],
    //   useFactory: (request: Request, loggerService: LoggerService) => {
    //     const service = new ExperimentsService(request, loggerService);

    //     return createProxy<ExperimentsService>(service, {
    //       before: (method, args) => {
    //         console.log(`[Proxy BEFORE] ${method} called with:`, args);
    //       },
    //       after: (method, result) => {
    //         console.log(`[Proxy AFTER] ${method} result:`, result);
    //       },
    //     });
    //   },
    // },
    ExperimentsService,
    // createProxiedProvider(ExperimentsService, [LoggerService]),
  ],
})
export class ExperimentsModule {}
