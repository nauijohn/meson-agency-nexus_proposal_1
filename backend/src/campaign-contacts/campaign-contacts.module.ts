import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CampaignContactsController } from "./campaign-contacts.controller";
import { CampaignContactsService } from "./campaign-contacts.service";
import { CampaignContact } from "./entities/campaign-contact.entity";
import { CampaignContactProfile } from "./mappers/campaign-contact.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([CampaignContact])],
  controllers: [CampaignContactsController],
  providers: [CampaignContactsService, CampaignContactProfile],
  exports: [CampaignContactsService],
})
export class CampaignContactsModule {}
