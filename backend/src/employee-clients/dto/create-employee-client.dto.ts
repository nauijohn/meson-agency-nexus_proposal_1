import { AutoMap } from "automapper-classes";
import { IsString } from "class-validator";

export class CreateEmployeeClientDto {
  @IsString()
  @AutoMap()
  employeeId: string;

  @IsString()
  @AutoMap()
  clientId: string;
}
