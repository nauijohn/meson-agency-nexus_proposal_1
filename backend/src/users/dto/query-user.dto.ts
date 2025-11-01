import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class QueryUserDto {
  @IsOptional()
  @Transform(({ value }) => value === "true")
  includeUnassignedClients?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === "true")
  includeClients?: boolean = false;
}
