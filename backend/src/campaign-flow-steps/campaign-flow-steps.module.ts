import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FlowsModule } from "../flows/flows.module";
import { CampaignFlowStep } from "./campaign-flow-step.entity";
import { CampaignFlowStepsService } from "./campaign-flow-steps.service";
import { CampaignFlowStepListener } from "./events/campaign-flow-step.listener";

@Module({
  imports: [TypeOrmModule.forFeature([CampaignFlowStep]), FlowsModule],
  providers: [CampaignFlowStepsService, CampaignFlowStepListener],
})
export class CampaignFlowStepsModule {}
