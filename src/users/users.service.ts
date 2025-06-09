import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserSchema, UserDocument } from './schemas/user.schema';
import { User } from '../auth/decorator/customize';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchema.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    try {
      // 1. Kiểm tra email tồn tại
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      // 2. Validate role
      const validRoles = ['USER', 'ADMIN', 'HR']; // Thêm các role hợp lệ
      if (!validRoles.includes(createUserDto.role)) {
        throw new BadRequestException('Invalid role');
      }

      // 3. Hash password
      const hashPassword = this.getHashPassword(createUserDto.password);

      // 4. Tạo user mới
      const newUser = await this.userModel.create({
        ...createUserDto,
        password: hashPassword,
      });

      // 5. Trả về thông tin user (không bao gồm password)
      const userResponse = newUser.toObject();
      const { password, ...userWithoutPassword } = userResponse;

      return userWithoutPassword;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Error creating user: ' + (error?.message || 'Unknown error'),
      );
    }
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const offset = (page - 1) * limit;
    const defaultLimit = limit || 10;
    const totalItems = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel
      .find(filter)
      .sort(sort as any)
      .skip(offset)
      .limit(defaultLimit)
      .select('-password')
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

  async findOne(id: string) {
    try {
      const user = await this.userModel
        .findOne({
          _id: id,
        })
        .select('-password');
      return user;
    } catch {
      return 'User not found';
    }
  }

  async findOneByUsername(username: string) {
    try {
      return this.userModel.findOne({
        email: username,
      });
    } catch {
      return null;
    }
  }

  isValidPassword(password: string, hashPassword: string) {
    try {
      return compareSync(password, hashPassword);
    } catch {
      return 'Error checking password';
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    try {
      const updatedUser = await this.userModel.updateOne(
        { _id: id },
        {
          ...updateUserDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );

      if (!updatedUser) {
        return 'User not found';
      }

      return updatedUser;
    } catch {
      return 'Error updating user';
    }
  }

  async remove(id: string, @User() user: IUser) {
    try {
      // Kiểm tra xem user có tồn tại không
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return 'Invalid user ID';
      }
      await this.userModel.updateOne(
        { _id: id },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );
      return this.userModel.softDelete({ _id: id });
    } catch {
      throw new BadRequestException('Error deleting user');
    }
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken: refreshToken },
    );
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };
}
