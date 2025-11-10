import { CampaignFactory } from "./campaign.factory";
import { ClientContactFactory } from "./client-contact.factory";
import { ClientFactory } from "./client.factory";
import { FlowActivityFactory } from "./flow-activity.factory";
import { FlowStepActivityFactory } from "./flow-step-activity.factory";
import { FlowStepFactory } from "./flow-step.factory";
import { FlowFactory } from "./flow.factory";
import { UserClientFactory } from "./user-client.factory";
import { UserFactory } from "./user.factory";

// export const seederFactories = [ClientFactory, CampaignFactory];
// export const seederSeeds = [ClientsSeeder, CampaignsSeeder];

export const seederFactories = [
  ClientFactory,
  CampaignFactory,
  ClientContactFactory,
  UserFactory,
  UserClientFactory,
  FlowActivityFactory,
  FlowFactory,
  FlowStepFactory,
  FlowStepActivityFactory,
];
