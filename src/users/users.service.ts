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

      // 4. Tạo user mới và trả về kết quả không bao gồm password
      const newUser = await this.userModel.create({
        ...createUserDto,
        password: hashPassword,
      });

      // 5. Query lại user vừa tạo nhưng loại bỏ password
      const userResponse = await this.userModel.findById(newUser._id).select('-password');

      return userResponse;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error creating user: ' + error.message);
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

  async register(registerUserDto: RegisterUserDto) {
    try {
      // 1. Kiểm tra email đã tồn tại chưa
      const existingUser = await this.findOneByUsername(registerUserDto.email);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      // 2. Tạo user mới với role mặc định là 'USER'
      const userToCreate: any = {
        ...registerUserDto,
        role: 'USER',
      };

      // 3. Xử lý company field nếu có
      if (Object.prototype.hasOwnProperty.call(registerUserDto, 'company')) {
        userToCreate.company = (registerUserDto as any).company;
      } else {
        delete userToCreate.company;
      }

      const newUser = await this.create(userToCreate);

      // 4. Trả về thông tin user đã tạo
      return {
        _id: newUser?._id,
        createAt: newUser?.createAt,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error registering user: ' + error.message);
    }
  }
}
