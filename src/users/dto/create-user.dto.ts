import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Too short name.' })
  @MaxLength(50, { message: 'Too long name.' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
