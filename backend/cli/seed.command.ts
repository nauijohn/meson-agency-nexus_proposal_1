import { Command, CommandRunner } from "nest-commander";
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";

import { ConfigService } from "@nestjs/config";

import { typeOrmConfigFactory } from "../src/typeorm.config";

@Command({ name: "seed", description: "a seed command" })
export class SeedCommand extends CommandRunner {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    console.log("Passed Params:", passedParams);
    console.log("Options:", options);
    const opts: DataSourceOptions & SeederOptions = {
      ...(typeOrmConfigFactory(this.configService) as DataSourceOptions),
      factories: ["/cli/**/*.factory{.ts,.js}"],
      seeds: ["/cli/**/*.seeder{.ts,.js}"],
    };
    const datasource = new DataSource(opts);
    datasource
      .initialize()
      .then(async () => {
        console.log("Seeding database...");
        await runSeeders(datasource);
        console.log("Seeding completed.");
        await datasource.destroy();
        process.exit();
      })
      .catch(async (error) => {
        console.error("Error during seeding:", error);
        await datasource.destroy();
        process.exit();
      });

    return Promise.resolve();
  }

  // @Option({
  //   flags: "-n, --number [number]",
  //   description: "A basic number parser",
  // })
  // parseNumber(val: string): number {
  //   return Number(val);
  // }
}
