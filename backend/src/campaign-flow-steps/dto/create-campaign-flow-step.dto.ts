import { Transform, Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class CreateCampaignFlowStepDto {
  @IsString()
  campaignId: string;

  @IsString()
  flowStepId: string;

  @IsDate()
  @Transform(({ value }) => new Date(String(value)))
  @Type(() => Date)
  scheduledAt: Date;

  @IsDate()
  @Transform(({ value }) => new Date(String(value)))
  @Type(() => Date)
  dueAt: Date;
}
