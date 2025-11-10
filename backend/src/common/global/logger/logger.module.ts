import { Global, Module } from "@nestjs/common";

import { LoggerService } from "./logger.service";

@Global()
@Module({
  // imports: [ClsModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
