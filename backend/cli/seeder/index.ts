import { CampaignFactory } from "./campaign.factory";
import { ClientContactFactory } from "./client-contact.factory";
import { ClientFactory } from "./client.factory";
import { MainSeeder } from "./main.seeder";
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
];
export const seederSeeds = [MainSeeder];
