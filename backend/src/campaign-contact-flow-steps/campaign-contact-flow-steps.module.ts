import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CampaignContactFlowStepsService } from "./campaign-contact-flow-steps.service";
import { CampaignContactFlowStep } from "./entities/campaign-contact-flow-step.entity";
import { CampaignContactFlowStepProfile } from "./mappers/campaign-contact-flow-step.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([CampaignContactFlowStep])],
  providers: [CampaignContactFlowStepsService, CampaignContactFlowStepProfile],
  exports: [CampaignContactFlowStepsService],
})
export class CampaignContactFlowStepsModule {}
