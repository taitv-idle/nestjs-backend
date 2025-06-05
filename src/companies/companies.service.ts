import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    try {
      const company = await this.companyModel.create({
        ...createCompanyDto,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      return company;
    } catch (error) {
      throw new Error('Error creating company');
    }
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    try {
      const company = await this.companyModel.findByIdAndUpdate(
        id,
        {
          ...updateCompanyDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
        { new: true },
      );

      if (!company) {
        throw new Error('Company not found');
      }

      return company;
    } catch {
      return {
        statusCode: 400,
        message: 'Error updating company',
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
