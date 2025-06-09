import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsMongoId,
  IsDateString,
  IsBoolean,
  Min,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import mongoose from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';

// Enum for job levels
export enum JobLevel {
  INTERN = 'Intern',
  FRESHER = 'Fresher',
  JUNIOR = 'Junior',
  MIDDLE = 'Middle',
  SENIOR = 'Senior',
  LEAD = 'Lead',
  MANAGER = 'Manager',
}

class CompanyDto {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên công việc không được để trống' })
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'Kỹ năng không được để trống' })
  skills: string[];

  @ValidateNested()
  @Type(() => CompanyDto)
  @IsNotEmpty({ message: 'Thông tin công ty không được để trống' })
  company: CompanyDto;

  @IsString()
  @IsNotEmpty({ message: 'Địa điểm làm việc không được để trống' })
  location: string;

  @IsNumber()
  @Min(0, { message: 'Lương không được âm' })
  @IsOptional()
  salary: number;

  @IsNumber()
  @Min(1, { message: 'Số lượng tuyển ít nhất là 1' })
  @IsOptional()
  quantity: number;

  @IsEnum(JobLevel, { message: 'Cấp bậc không hợp lệ' })
  @IsOptional()
  level: string;

  @IsString()
  @IsNotEmpty({ message: 'Mô tả công việc không được để trống' })
  description: string;

  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
