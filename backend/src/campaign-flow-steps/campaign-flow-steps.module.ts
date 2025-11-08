import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CampaignFlowStepsController } from "./campaign-flow-steps.controller";
import { CampaignFlowStepsService } from "./campaign-flow-steps.service";
import { CampaignFlowStep } from "./entities/campaign-flow-step.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CampaignFlowStep])],
  controllers: [CampaignFlowStepsController],
  providers: [CampaignFlowStepsService],
  exports: [CampaignFlowStepsService],
})
export class CampaignFlowStepsModule {}
