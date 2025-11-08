import { Module } from "@nestjs/common";

import { AppModule } from "../src/app.module";
import { SeedCommand } from "./seed.command";

@Module({
  imports: [AppModule],
  providers: [SeedCommand],
})
export class CliModule {}
