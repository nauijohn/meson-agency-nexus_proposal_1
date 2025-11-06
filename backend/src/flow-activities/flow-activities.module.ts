import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FlowActivity } from "./entities/flow-activity.entity";
import { FlowActivitiesController } from "./flow-activities.controller";
import { FlowActivitiesService } from "./flow-activities.service";
import { FlowActivityProfile } from "./mappers/flow-activity.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([FlowActivity])],
  controllers: [FlowActivitiesController],
  providers: [FlowActivitiesService, FlowActivityProfile],
})
export class FlowActivitiesModule {}
