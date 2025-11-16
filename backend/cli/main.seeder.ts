import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { Campaign } from "../src/campaigns/entities/campaign.entity";
import { ClientContact } from "../src/client-contacts/entities/client-contact.entity";
import { Client } from "../src/clients/entities/client.entity";
import { EmployeeClient } from "../src/employee-clients/entities/employee-client.entity";

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log("Running MainSeeder...");

    const campaignFactory = factoryManager.get(Campaign);
    const clientFactory = factoryManager.get(Client);
    const clientContactFactory = factoryManager.get(ClientContact);
    // const userFactory = factoryManager.get(User);
    const userClientFactory = factoryManager.get(EmployeeClient);

    // const client = await clientFactory.save();

    // Generate 50 campaigns, each with its own client

    // for (let i = 0; i < 20; i++) {
    //   const user = await userFactory.save();
    //   for (let i = 0; i < 50; i++) {
    //     const clientContacts = await clientContactFactory.saveMany(10);
    //     const client = await clientFactory.save({ contacts: clientContacts });

    //     await userClientFactory.save({
    //       client,
    //       user,
    //     });

    //     await campaignFactory.saveMany(faker.number.int({ min: 1, max: 50 }), {
    //       client,
    //     });
    //   }
    // }

    const NUMBER_OF_USERS = 20;
    const NUMBER_OF_CLIENTS_PER_USER = 5;
    const NUMBER_OF_CLIENT_CONTACTS_PER_CLIENT = 20;
    const NUMBER_OF_CAMPAIGNS_PER_CLIENT = 10;

    await Promise.all(
      Array.from({ length: NUMBER_OF_USERS }).map(async () => {
        // const user = await userFactory.save();
        await Promise.all(
          Array.from({ length: NUMBER_OF_CLIENTS_PER_USER }).map(async () => {
            const clientContacts = await clientContactFactory.saveMany(
              NUMBER_OF_CLIENT_CONTACTS_PER_CLIENT,
            );
            const client = await clientFactory.save({
              contacts: clientContacts,
            });

            // const [clientContacts, client] = await Promise.all([
            //   clientContactFactory.saveMany(10),
            //   clientFactory.save({ contacts: clientContacts }),
            // ]);

            await Promise.all([
              userClientFactory.save({
                client,
                employee: null!, // Will be set by the factory
              }),
              campaignFactory.saveMany(NUMBER_OF_CAMPAIGNS_PER_CLIENT, {
                client,
              }),
            ]);
          }),
        );
      }),
    );
  }
}
