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
  name: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsArray()
  @ValidateNested({ each: true })
  activities: string[];
}
