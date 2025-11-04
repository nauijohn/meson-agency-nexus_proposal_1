import { IsString } from "class-validator";

export class CreateFlowStepActivityDto {
  @IsString()
  flowStepId: string;

  @IsString()
  flowActivityId: string;
}
