import { AutoMap } from "automapper-classes";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { ActivityType } from "../entities/flow-activity.entity";

export class CreateFlowActivityDto {
  @IsEnum(ActivityType)
  @IsNotEmpty()
  @AutoMap()
  type: ActivityType;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  name: string;
}
