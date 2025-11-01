import { IsEmail, IsString } from "class-validator";

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  businessName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  contactPerson: string;

  @IsString()
  phoneNumber: string;
}
