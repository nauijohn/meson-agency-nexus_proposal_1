import { PartialType } from "@nestjs/mapped-types";

import { CreateCampaignFlowStepDto } from "./create-campaign-flow-step.dto";

export class UpdateCampaignFlowStepDto extends PartialType(
  CreateCampaignFlowStepDto,
) {}
