import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export abstract class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit: number = 2;
}
