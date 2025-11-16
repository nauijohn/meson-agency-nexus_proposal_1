import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import { EmployeeClient } from "../../src/employee-clients/entities/employee-client.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const EmployeeClientFactory = setSeederFactory(EmployeeClient, () => {
  const entity = new EmployeeClient();
  entity.assignedDate = faker.date.past({});
  return entity;
});
