import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Campaign } from "../../src/campaigns/entities/campaign.entity";
import { ClientContact } from "../../src/client-contacts/entities/client-contact.entity";
import { Client } from "../../src/clients/entities/client.entity";
import { UserClient } from "../../src/user-clients/entities/user-client.entity";
import { User } from "../../src/users";

export class DeleteAllSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.log("Deleting all data...");
    await dataSource.getRepository(UserClient).deleteAll();
    await dataSource.getRepository(Campaign).deleteAll();
    await dataSource.getRepository(Client).deleteAll();
    await dataSource.getRepository(User).deleteAll();

    await dataSource.getRepository(ClientContact).deleteAll();
  }
}
