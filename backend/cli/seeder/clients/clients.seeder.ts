import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { Client } from "../../../src/clients/entities/client.entity";

export class ClientsSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log("Running ClientsSeeder...");
    // const repo = dataSource.getRepository(Client);

    const factory = factoryManager.get(Client);

    await factory.saveMany(10);
  }
}
