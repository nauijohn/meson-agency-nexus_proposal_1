import { Command, CommandRunner } from "nest-commander";
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";

import { ConfigService } from "@nestjs/config";

import { typeOrmConfigFactory } from "../src/typeorm.config";
import { DeleteAllSeeder } from "./delete-all.seeder";
import { seederFactories } from "./factories";
import { FlowsSeeder } from "./flows.seeder";
import { InitialSeeder } from "./ininital.seeder";
import { MainSeeder } from "./main.seeder";

@Command({ name: "seed", description: "a seed command" })
export class SeedCommand extends CommandRunner {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async run(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _passedParams: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: Record<string, any>,
  ): Promise<void> {
    const opts: DataSourceOptions & SeederOptions = {
      ...(typeOrmConfigFactory(this.configService) as DataSourceOptions),
      factories: seederFactories,
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
        seeds: [InitialSeeder, FlowsSeeder],
      });

      await runSeeders(result, {
        factories: seederFactories,
        seeds: [MainSeeder],
      });

      console.log("Seeding complete...");
      await result.destroy();
    } catch (error) {
      console.error("Error during seeding:", error);
      await result.destroy();
      process.exit(1);
    }
  }
}
