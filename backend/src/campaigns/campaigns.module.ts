import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientsModule } from "../clients";
import { CampaignsController } from "./campaigns.controller";
import { CampaignsService } from "./campaigns.service";
import { Campaign } from "./entities/campaign.entity";
import { CampaignSubscriber } from "./events/campaigns.subscriber";
import { CampaignProfile } from "./mappers/campaign.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), ClientsModule],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignSubscriber, CampaignProfile],
})
export class CampaignsModule {}
