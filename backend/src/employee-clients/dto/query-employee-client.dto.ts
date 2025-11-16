import { IsOptional, IsString } from "class-validator";

import { PaginationDto } from "../../common/bases";

export class QueryEmployeeClientDto extends PaginationDto {
  @IsOptional()
  @IsString()
  employeeId?: string;
}
