import { Expose } from "class-transformer";

import { BaseDto } from "../../common/bases/base.dto";

export class CampaignFlowStepDto extends BaseDto {
  @Expose()
  completedAt?: Date;

  @Expose()
  scheduledAt?: Date;

  @Expose()
  dueAt?: Date;
}
