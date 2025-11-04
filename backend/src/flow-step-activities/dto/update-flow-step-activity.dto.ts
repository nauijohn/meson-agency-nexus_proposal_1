import { PartialType } from "@nestjs/mapped-types";

import { CreateFlowActivityDto } from "../../flow-activities/dto/create-flow-activity.dto";

export class UpdateFlowStepActivityDto extends PartialType(
  CreateFlowActivityDto,
) {}
