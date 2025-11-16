import { AutoMap } from "automapper-classes";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

import { CreateCampaignFlowStepDto } from "../../campaign-flow-steps/dto/create-campaign-flow-step.dto";

export class CreateCampaignDto {
  @IsString()
  @AutoMap()
  name: string;

  @IsString()
  @AutoMap()
  description: string;

  @IsDate()
  @Transform(({ value }) => new Date(String(value)))
  @AutoMap()
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(String(value)))
  @AutoMap(() => Date)
  endDate: Date | null;

  // Relations

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  flowId?: string;

  @IsOptional({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCampaignFlowStepDto)
  campaignFlowSteps?: CreateCampaignFlowStepDto[];
}
