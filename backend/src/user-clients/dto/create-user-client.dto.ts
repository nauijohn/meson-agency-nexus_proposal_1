import { AutoMap } from "automapper-classes";
import { IsString } from "class-validator";

export class CreateUserClientDto {
  @IsString()
  @AutoMap()
  userId: string;

  @IsString()
  @AutoMap()
  clientId: string;
}
