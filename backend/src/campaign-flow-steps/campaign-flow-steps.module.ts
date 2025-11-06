import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FlowsModule } from "../flows/flows.module";
import { CampaignFlowStepsController } from "./campaign-flow-steps.controller";
import { CampaignFlowStepsService } from "./campaign-flow-steps.service";
import { CampaignFlowStep } from "./entities/campaign-flow-step.entity";
import { CampaignFlowStepListener } from "./events/campaign-flow-step.listener";

@Module({
  imports: [TypeOrmModule.forFeature([CampaignFlowStep]), FlowsModule],
  controllers: [CampaignFlowStepsController],
  providers: [CampaignFlowStepsService, CampaignFlowStepListener],
})
export class CampaignFlowStepsModule {}
