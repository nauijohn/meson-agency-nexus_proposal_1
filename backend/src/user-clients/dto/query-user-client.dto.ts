import { IsOptional, IsString } from "class-validator";

import { PaginationDto } from "../../common/bases";

export class QueryUserClientDto extends PaginationDto {
  @IsOptional()
  @IsString()
  userId?: string;
}
