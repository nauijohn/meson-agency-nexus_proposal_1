import { Expose, Type } from "class-transformer";

import { CampaignContactFlowStepDto } from "../../campaign-contact-flow-steps/dto/campaign-contact-flow-step.dto";
import { CampaignFlowStepDto } from "../../campaign-flow-steps/dto/campaign-flow-step.dto";
import { ClientDto } from "../../clients/dto/client.dto";
import { BaseDto } from "../../common/bases/base.dto";
import { FlowDto } from "../../flows/dto/flow.dto";

export class CampaignDto extends BaseDto {
  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date | null;

  @Expose()
  status: "active" | "paused" | "completed";

  @Expose()
  @Type(() => ClientDto)
  client: ClientDto;

  @Expose()
  @Type(() => FlowDto)
  flow: FlowDto;

  @Expose()
  @Type(() => CampaignFlowStepDto)
  campaignFlowSteps: CampaignFlowStepDto[];

  @Expose()
  @Type(() => CampaignContactFlowStepDto)
  contactFlowSteps: CampaignContactFlowStepDto[];
}
