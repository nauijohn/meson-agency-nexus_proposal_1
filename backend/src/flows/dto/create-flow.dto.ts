import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { CreateFlowStepDto } from "../../flow_steps/dto/create-flow-step.dto";

export class CreateFlowDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  // @IsOptional()
  // steps: {
  //   name: string;
  //   order: number;
  //   activities: string[];
  // }[];

  @IsOptional()
  steps: CreateFlowStepDto[];
}
