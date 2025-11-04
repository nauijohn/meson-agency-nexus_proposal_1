import { Transform, Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

import { CreateCampaignFlowStepDto } from "../../campaign-flow-steps/dto/create-campaign-flow-step.dto";

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  @Transform((e) => {
    return new Date(e.value as string);
  })
  startDate: Date;

  @IsDate()
  @Transform((e) => {
    return new Date(e.value as string);
  })
  endDate: Date;

  // Relations

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  flowId?: string;

  @IsOptional({ each: true })
  @Type(() => CreateCampaignFlowStepDto)
  campaignFlowSteps?: CreateCampaignFlowStepDto[];
}
