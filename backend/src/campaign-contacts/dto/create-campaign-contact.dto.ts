import { IsNotEmpty, IsString } from "class-validator";

export class CreateCampaignContactDto {
  @IsNotEmpty()
  @IsString()
  clientContactId: string;

  @IsNotEmpty()
  @IsString()
  campaignId: string;
}
