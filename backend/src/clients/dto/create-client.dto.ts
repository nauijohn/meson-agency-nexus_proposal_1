import { AutoMap } from "automapper-classes";
import { IsEmail, IsString } from "class-validator";

export class CreateClientDto {
  @IsString()
  @AutoMap()
  name: string;

  @IsString()
  @AutoMap()
  businessName: string;

  @IsString()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsString()
  @AutoMap()
  contactPerson: string;

  @IsString()
  @AutoMap()
  phoneNumber: string;
}
