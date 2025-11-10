import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import { Campaign } from "../../src/campaigns/entities/campaign.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const CampaignFactory = setSeederFactory(Campaign, () => {
  const campaign = new Campaign();
  campaign.name = faker.company.name();
  campaign.description = faker.finance.transactionDescription();
  campaign.startDate = faker.date.past();
  campaign.endDate = faker.date.future();
  campaign.status = faker.helpers.arrayElement(["active"]);

  return campaign;
});
