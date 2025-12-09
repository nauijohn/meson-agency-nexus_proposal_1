import { AutoMap } from "automapper-classes";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateFlowStepDto {
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @AutoMap()
  order: number;

  @IsArray()
  @IsUUID("4", { each: true })
  activities: string[];

  @IsOptional()
  @IsUUID()
  flowId?: string;
}
