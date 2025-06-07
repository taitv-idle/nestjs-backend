import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';

class CompanyDto {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  @MaxLength(16, { message: 'Password không được quá 16 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;

  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  role: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyDto)
  company?: CompanyDto;
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
