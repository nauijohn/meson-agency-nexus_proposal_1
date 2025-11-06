import { AutoMap } from "automapper-classes";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
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
  @ValidateNested({ each: true })
  activities: string[];
}
