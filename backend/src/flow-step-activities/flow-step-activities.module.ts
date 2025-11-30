import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FlowStepActivity } from "./entities/flow-step-activity.entity";
import {
  FlowStepActivitiesController,
} from "./flow-step-activities.controller";
import { FlowStepActivitiesService } from "./flow-step-activities.service";
import {
  FlowStepActivityProfile,
} from "./mappers/flow-step-activity.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([FlowStepActivity])],
  controllers: [FlowStepActivitiesController],
  providers: [FlowStepActivitiesService, FlowStepActivityProfile],
})
export class FlowStepActivitiesModule {}
