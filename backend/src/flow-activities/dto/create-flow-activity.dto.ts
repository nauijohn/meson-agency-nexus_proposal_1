import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { ActivityType } from "../flow-activity.entity";

export class CreateFlowActivityDto {
  @IsEnum(ActivityType)
  @IsNotEmpty()
  type: ActivityType;

  @IsNotEmpty()
  @IsString()
  name: string;
}
