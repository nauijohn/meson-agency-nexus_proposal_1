import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FlowStep } from "./entities/flow-step.entity";
import { FlowStepsService } from "./flow-steps.service";
import { FlowStepProfile } from "./mappers/flow-step.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([FlowStep])],
  providers: [FlowStepsService, FlowStepProfile],
})
export class FlowStepsModule {}
