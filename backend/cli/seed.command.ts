import { Command, CommandRunner } from "nest-commander";
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";

import { ConfigService } from "@nestjs/config";

import { typeOrmConfigFactory } from "../src/typeorm.config";
import { DeleteAllSeeder } from "./delete-all/delete-all.seeder";
import { initialSeederFactories, initialSeederSeeds } from "./initial-seeder";
import { seederFactories, seederSeeds } from "./seeder";

@Command({ name: "seed", description: "a seed command" })
export class SeedCommand extends CommandRunner {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    console.log("Passed Params:", passedParams);
    console.log("Options:", options);
    const opts: DataSourceOptions & SeederOptions = {
      ...(typeOrmConfigFactory(this.configService) as DataSourceOptions),
    };

    const datasource = new DataSource(opts);

    const result = await datasource.initialize();
    try {
      console.log("Deleting all existing data...");
      await runSeeders(result, {
        seeds: [DeleteAllSeeder],
      });

      console.log("Seeding started...");
      await runSeeders(result, {
        factories: initialSeederFactories,
        seeds: initialSeederSeeds,
      });
      await runSeeders(result, {
        factories: seederFactories,
        seeds: seederSeeds,
      });

      console.log("Seeding complete...");
      await datasource.destroy();
    } catch (error) {
      console.error("Error during seeding:", error);
      await datasource.destroy();
      process.exit(1);
    }
  }
}
