import { Expose, Type } from "class-transformer";

import { CampaignDto } from "../../campaigns/dto/campaign.dto";
import { BaseDto } from "../../common/bases/base.dto";

export class ClientDto extends BaseDto {
  @Expose()
  @Type(() => CampaignDto)
  campaigns: CampaignDto[];
}
