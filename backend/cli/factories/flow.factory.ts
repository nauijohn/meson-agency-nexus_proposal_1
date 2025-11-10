import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import { Flow } from "../../src/flows/entities/flow.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const FlowFactory = setSeederFactory(Flow, () => {
  const entity = new Flow();
  entity.name = faker.word.adjective() + " flow";
  return entity;
});
