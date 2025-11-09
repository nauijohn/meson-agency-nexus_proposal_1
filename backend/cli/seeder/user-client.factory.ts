import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import { UserClient } from "../../src/user-clients/entities/user-client.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const UserClientFactory = setSeederFactory(UserClient, () => {
  const entity = new UserClient();
  entity.assignedDate = faker.date.past({});
  return entity;
});
