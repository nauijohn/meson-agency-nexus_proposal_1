import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FlowActivitiesController } from "./flow-activities.controller";
import { FlowActivitiesService } from "./flow-activities.service";
import { FlowActivity } from "./flow-activity.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FlowActivity])],
  controllers: [FlowActivitiesController],
  providers: [FlowActivitiesService],
  exports: [FlowActivitiesService],
})
export class FlowActivitiesModule {}
