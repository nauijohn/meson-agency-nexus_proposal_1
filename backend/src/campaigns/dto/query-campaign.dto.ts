import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class QueryCampaignDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  unassignedFlow?: boolean = false;
}
