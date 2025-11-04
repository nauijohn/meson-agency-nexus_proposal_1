import { Expose } from "class-transformer";

import { BaseDto } from "../../common/bases/base.dto";
import { FlowStepActivityDto } from "../../flow-step-activities/dto/flow-step-activity.dto";

export class FlowStepDto extends BaseDto {
  @Expose()
  order: number;

  @Expose()
  stepActivities: FlowStepActivityDto[];
}
