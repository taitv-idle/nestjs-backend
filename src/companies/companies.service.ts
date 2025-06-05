import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

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

  async findAll(page: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const offset = (page - 1) * limit;
    const defaultLimit = limit || 10;
    const totalItems = await this.companyModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.companyModel
      .find(filter)
      // @ts-ignore
      .sort(sort)
      .skip(offset)
      .limit(defaultLimit)
      .select(projection)
      .populate(population);
    return {
      meta: {
        currentPage: page,
        itemCount: result.length,
        itemsPerPage: limit,
        totalPages,
        totalItems,
      },
      result,
    };
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

  async remove(id: string, user: IUser) {
    try {
      const company = await this.companyModel.findById(id);
      if (!company) {
        return {
          statusCode: 404,
          message: 'Company not found',
        };
      }

      const deletedCompany = await this.companyModel.softDelete({ _id: id });

      await this.companyModel.updateOne(
        { _id: id },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );

      if (!deletedCompany) {
        return {
          statusCode: 400,
          message: 'Error deleting company',
        };
      }

      return {
        statusCode: 200,
        message: 'Company deleted successfully',
        data: deletedCompany,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
      };
    }
  }
}
