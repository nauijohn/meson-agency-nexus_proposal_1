import { Injectable } from "@nestjs/common";

import { LoggerService } from "../common/global/logger/logger.service";

@Injectable()
export class ExperimentsService {
  constructor(private readonly loggerService: LoggerService) {}
  testing() {
    this.loggerService.log("Experiments service testing method called");
    // console.log("Experiments service testing method called");
    return { message: "Experiments service is working!" };
  }
}
