import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker"; // <-- import locale directly

import { Client } from "../../../src/clients/entities/client.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const ClientFactory = setSeederFactory(Client, () => {
  const client = new Client();
  client.name = faker.person.fullName();
  client.businessName = faker.company.name();
  client.email = faker.internet.email();
  client.contactPerson = faker.person.fullName();
  client.phoneNumber = faker.phone.number();
  client.status = faker.helpers.arrayElement(["active", "inactive"]);
  return client;
});
