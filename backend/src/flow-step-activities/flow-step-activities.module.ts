import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FlowStepActivitiesService } from "./flow-step-activities.service";
import { FlowStepActivity } from "./flow-step-activity.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FlowStepActivity])],
  providers: [FlowStepActivitiesService],
})
export class FlowStepActivitiesModule {}
