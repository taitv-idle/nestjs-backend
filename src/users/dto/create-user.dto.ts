import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email Không hợp lệ' })
  @IsNotEmpty({ message: 'Email Không đc để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password Không đc để trống' })
  @Min(8, { message: 'Password phải có ít nhất 8 ký tự' })
  @Max(16, { message: 'Password không được quá 16 ký tự' })
  password: string;

  name: string;
}
