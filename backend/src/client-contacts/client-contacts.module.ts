import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientContactsController } from "./client-contacts.controller";
import { ClientContactsService } from "./client-contacts.service";
import { ClientContact } from "./entities/client-contact.entity";
import { ClientContactProfile } from "./mappers/client-contact.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([ClientContact])],
  controllers: [ClientContactsController],
  providers: [ClientContactsService, ClientContactProfile],
  exports: [ClientContactsService],
})
export class ClientContactsModule {}
