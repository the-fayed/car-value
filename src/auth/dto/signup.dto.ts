import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(3, 32, { message: 'Name must be between 3 to 32 characters' })
  name: string;

  @IsStrongPassword()
  password: string;
}
