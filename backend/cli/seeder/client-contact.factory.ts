import { setSeederFactory } from "typeorm-extension";

import { en, Faker } from "@faker-js/faker";

import {
  ClientContact,
  ClientContactStatus,
  ClientContactType,
} from "../../src/client-contacts/entities/client-contact.entity";

const faker = new Faker({ locale: [en] }); // ✅ use locale object, not faker.locales

export const ClientContactFactory = setSeederFactory(ClientContact, () => {
  const clientContact = new ClientContact();
  clientContact.name = faker.person.fullName();
  clientContact.preferred = faker.datatype.boolean();
  clientContact.contactNumber = faker.helpers.fromRegExp("+614[0-9]{8}");
  clientContact.status = faker.helpers.enumValue(ClientContactStatus);
  clientContact.type = faker.helpers.enumValue(ClientContactType);

  return clientContact;
});
