import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import { FlowStep } from "../../src/flow_steps/entities/flow-step.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const FlowStepFactory = setSeederFactory(FlowStep, () => {
  const entity = new FlowStep();
  entity.name = faker.word.adjective() + " flow step";
  return entity;
});
