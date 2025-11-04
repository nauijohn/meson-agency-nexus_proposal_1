import { Expose, Type } from "class-transformer";

import { BaseDto } from "../../common/bases/base.dto";
import { FlowStepDto } from "../../flow_steps/dto/flow-step.dto";

export class FlowDto extends BaseDto {
  @Expose()
  @Type(() => FlowStepDto)
  steps: FlowStepDto[];
}
