import { IsNotEmpty, IsString } from "class-validator";

export class CreateCampaignContactFlowStepDto {
  @IsNotEmpty()
  @IsString()
  clientContactId: string;

  @IsNotEmpty()
  @IsString()
  campaignId: string;
}
