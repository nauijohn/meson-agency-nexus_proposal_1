import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import { User } from "../../src/users/entities/user.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const UserFactory = setSeederFactory(User, () => {
  const entity = new User();
  entity.firstName = faker.person.firstName();
  entity.lastName = faker.person.lastName();
  entity.email = faker.internet.email({
    firstName: entity.firstName,
    lastName: entity.lastName,
  });
  entity.password = "Password123!";
  return entity;
});
