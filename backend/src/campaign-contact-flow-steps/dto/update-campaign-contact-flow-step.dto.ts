import { PartialType } from "@nestjs/mapped-types";

import { CreateCampaignContactFlowStepDto } from "./create-campaign-contact-flow-step.dto";

export class UpdateCampaignContactFlowStepDto extends PartialType(
  CreateCampaignContactFlowStepDto,
) {}
