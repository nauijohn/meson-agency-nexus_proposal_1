import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker"; // <-- import locale directly

import {
  ActivityType,
  FlowActivity,
} from "../../../src/flow-activities/entities/flow-activity.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const FlowActivityFactory = setSeederFactory(FlowActivity, () => {
  const flowActivity = new FlowActivity();
  flowActivity.name = faker.lorem.sentence();
  flowActivity.type = ActivityType.voice;
  flowActivity.createdAt = faker.date.past();
  flowActivity.updatedAt = faker.date.recent();
  return flowActivity;
});
