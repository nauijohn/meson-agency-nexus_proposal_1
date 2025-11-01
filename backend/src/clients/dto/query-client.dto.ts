import { IsOptional } from "class-validator";

export class QueryClientDto {
  @IsOptional()
  userId?: string = undefined;

  @IsOptional()
  isAssigned?: boolean = true;
}
