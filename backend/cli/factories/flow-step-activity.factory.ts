import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import { FlowStepActivity } from "../../src/flow-step-activities/entities/flow-step-activity.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const FlowStepActivityFactory = setSeederFactory(
  FlowStepActivity,
  () => {
    const entity = new FlowStepActivity();
    return entity;
  },
);
