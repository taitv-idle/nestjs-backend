import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, MaxLength, MinLength, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

class CompanyDto {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}


export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không đc để trống' })
  name: string;

  @IsEmail({}, { message: 'Email Không hợp lệ' })
  @IsNotEmpty({ message: 'Email Không đc để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password Không đc để trống' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  @MaxLength(16, { message: 'Password không được quá 16 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Tuổi không đc để trống' })
  age: number;

  @IsNotEmpty({ message: 'Giới tính không đc để trống' })
  gender: string;

  @IsNotEmpty({ message: 'Địa chỉ không đc để trống' })
  address: string;

  @IsNotEmpty({ message: 'Vai trò không đc để trống' })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Email Không hợp lệ' })
  @IsNotEmpty({ message: 'Email Không đc để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password Không đc để trống' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  @MaxLength(16, { message: 'Password không được quá 16 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Tuổi không đc để trống' })
  age: number;

  @IsNotEmpty({ message: 'Giới tính không đc để trống' })
  gender: string;

  @IsNotEmpty({ message: 'Địa chỉ không đc để trống' })
  address: string;
}
