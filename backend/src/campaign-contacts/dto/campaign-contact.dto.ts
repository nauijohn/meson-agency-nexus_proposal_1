import { Expose } from "class-transformer";

import { CampaignContactStatus } from "../entities/campaign-contact.entity";

export class CampaignContactDto {
  @Expose()
  status: CampaignContactStatus;

  @Expose()
  startedAt?: Date | null;

  @Expose()
  completedAt?: Date | null;

  @Expose()
  isConnected: boolean;
}
