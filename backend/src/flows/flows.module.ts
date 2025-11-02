import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FlowActivitiesModule } from "../flow-activities/flow-activities.module";
import { FlowStepActivitiesModule } from "../flow-step-activities/flow-step-activities.module";
import { FlowStepsModule } from "../flow_steps/flow-steps.module";
import { Flow } from "./flow.entity";
import { FlowsController } from "./flows.controller";
import { FlowsService } from "./flows.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Flow]),
    FlowStepsModule,
    FlowActivitiesModule,
    FlowStepActivitiesModule,
  ],
  controllers: [FlowsController],
  providers: [FlowsService],
})
export class FlowsModule {}
