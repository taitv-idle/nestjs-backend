import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
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
      throw new BadRequestException('Error creating user: ' + (error?.message || 'Unknown error'));
    }
  }

  findAll() {
    return `This action returns all users`;
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.updateOne(
        { _id: id },
        {
          ...updateUserDto,
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

  async remove(id: string) {
    try {
      const deletedUser = await this.userModel.softDelete({ _id: id });
      if (!deletedUser) {
        return 'User not found';
      }

      return 'User deleted successfully';
    } catch {
      return 'Error deleting user';
    }
  }
}
