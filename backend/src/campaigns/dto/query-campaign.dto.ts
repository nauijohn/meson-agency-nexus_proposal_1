import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

import { PaginationDto } from "../../common/bases/dto/pagination.dto";

export class QueryCampaignDto extends PaginationDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  unassignedFlow?: boolean = false;

  @IsOptional()
  clientId?: string;
}
