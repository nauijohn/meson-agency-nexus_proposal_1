import { Expose } from "class-transformer";

import { CampaignContactFlowStepStatus } from "../entities/campaign-contact-flow-step.entity";

export class CampaignContactFlowStepDto {
  @Expose()
  status: CampaignContactFlowStepStatus;

  @Expose()
  startedAt?: Date | null;

  @Expose()
  completedAt?: Date | null;

  @Expose()
  isConnected: boolean;
}
