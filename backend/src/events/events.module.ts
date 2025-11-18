import { Module } from "@nestjs/common";

import { CampaignContactsModule } from "../campaign-contacts/campaign-contacts.module";
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
    CampaignContactsModule,

    EmployeesModule,
  ],
  providers: [CampaignsListener, UserEventsListener],
})
export class EventsModule {}
