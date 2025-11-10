import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

export const TOTAL_KEY = "total";

export abstract class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number = DEFAULT_PAGE;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit: number = DEFAULT_LIMIT;
}
