import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Flow } from "./entities/flow.entity";
import { FlowsController } from "./flows.controller";
import { FlowsService } from "./flows.service";
import { FlowProfile } from "./mappers/flow.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([Flow])],
  controllers: [FlowsController],
  providers: [FlowsService, FlowProfile],
  exports: [FlowsService],
})
export class FlowsModule {}
