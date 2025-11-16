import { Module } from "@nestjs/common";

import { CampaignContactFlowStepsModule } from "../campaign-contact-flow-steps/campaign-contact-flow-steps.module";
import { CampaignFlowStepsModule } from "../campaign-flow-steps";
import { CampaignsModule } from "../campaigns/campaigns.module";
import { EmployeesModule } from "../employees/employees.module";
import { FlowsModule } from "../flows/flows.module";
import { CampaignsListener } from "./listeners/campaigns.listener";
import { UserEventsListener } from "./listeners/user.events.listener";

@Module({
  imports: [
    FlowsModule,
    CampaignsModule,
    CampaignFlowStepsModule,
    CampaignContactFlowStepsModule,

    EmployeesModule,
  ],
  providers: [CampaignsListener, UserEventsListener],
})
export class EventsModule {}
