import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import { Client } from "../../src/clients/entities/client.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const ClientFactory = setSeederFactory(Client, () => {
  const name = faker.person.fullName();
  const client = new Client();
  client.name = name;
  client.businessName = faker.company.name();
  client.email = faker.internet.email();
  client.contactPerson = name;
  client.phoneNumber = faker.helpers.fromRegExp("+614[0-9]{8}");
  client.status = faker.helpers.arrayElement(["active", "inactive"]);
  return client;
});
