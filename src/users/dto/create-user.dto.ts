import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email Không hợp lệ' })
  @IsNotEmpty({ message: 'Email Không đc để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password Không đc để trống' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  @MaxLength(16, { message: 'Password không được quá 16 ký tự' })
  password: string;

  name: string;
}
