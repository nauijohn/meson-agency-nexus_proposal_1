import { AutoMap } from "automapper-classes";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class ClientContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;
}

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

  @IsOptional()
  @Type(() => ClientContactDto)
  @ValidateNested({ each: true })
  @IsArray()
  contacts?: ClientContactDto[];
}
