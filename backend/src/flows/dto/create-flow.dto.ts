import { AutoMap } from "automapper-classes";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { CreateFlowStepDto } from "../../flow_steps/dto/create-flow-step.dto";

export class CreateFlowDto {
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  name: string;

  @IsOptional()
  @AutoMap(() => [CreateFlowStepDto])
  steps: CreateFlowStepDto[];
}
