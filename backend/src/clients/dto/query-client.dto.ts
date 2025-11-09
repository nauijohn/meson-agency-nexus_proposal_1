import { IsOptional } from "class-validator";

import { PaginationDto } from "../../common/bases";

export class QueryClientDto extends PaginationDto {
  @IsOptional()
  userId?: string = undefined;

  @IsOptional()
  isAssigned?: boolean = true;
}
