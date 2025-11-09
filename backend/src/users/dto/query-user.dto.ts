import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

import { PaginationDto } from "../../common/bases";

export class QueryUserDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => value === "true")
  includeUnassignedClients?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === "true")
  includeClients?: boolean = false;
}
