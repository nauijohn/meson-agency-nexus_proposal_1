import { Module } from "@nestjs/common";

import { CampaignContactFlowStepsModule } from "../campaign-contact-flow-steps/campaign-contact-flow-steps.module";
import { CampaignFlowStepsModule } from "../campaign-flow-steps";
import { CampaignsModule } from "../campaigns/campaigns.module";
import { FlowsModule } from "../flows/flows.module";
import { CampaignsListener } from "./campaigns.listener";

@Module({
  imports: [
    FlowsModule,
    CampaignsModule,
    CampaignFlowStepsModule,
    CampaignContactFlowStepsModule,
  ],
  providers: [CampaignsListener],
})
export class EventListenersModule {}
