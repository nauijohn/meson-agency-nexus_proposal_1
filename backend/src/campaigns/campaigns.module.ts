import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientsModule } from "../clients";
import { Campaign } from "./campaign.entity";
import { CampaignsController } from "./campaigns.controller";
import { CampaignsService } from "./campaigns.service";
import { CampaignSubscriber } from "./events/campaigns.subscriber";

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), ClientsModule],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignSubscriber],
})
export class CampaignsModule {}
