import { Transform } from "class-transformer";
import { IsDate, IsString } from "class-validator";

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

  @IsString()
  clientId: string;
}
