import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FlowStep } from "./flow-step.entity";
import { FlowStepsService } from "./flow-steps.service";

@Module({
  imports: [TypeOrmModule.forFeature([FlowStep])],
  providers: [FlowStepsService],
  exports: [FlowStepsService],
})
export class FlowStepsModule {}
