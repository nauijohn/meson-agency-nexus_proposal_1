import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientsController } from "./clients.controller";
import { ClientsService } from "./clients.service";
import { Client } from "./entities/client.entity";
import { ClientsSubscriber } from "./events/clients.subscriber";
import { ClientProfile } from "./mappers/client.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [ClientsService, ClientProfile, ClientsSubscriber],
  exports: [ClientsService],
})
export class ClientsModule {}
