import { Expose, Type } from "class-transformer";

import { BaseDto } from "../../common/bases/base.dto";
import { FlowActivityDto } from "../../flow-activities/dto/flow-activity.dto";

export class FlowStepActivityDto extends BaseDto {
  @Expose()
  @Type(() => FlowActivityDto)
  activity: FlowActivityDto;

  @Expose()
  completedAt: Date | null;
}
