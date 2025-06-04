import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword = (password) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new Error('Email already exists');
      }
      const hashPassword = this.getHashPassword(createUserDto.password);
      const newUser = await this.userModel.create({
        ...createUserDto,
        password: hashPassword,
      });
      return newUser;
    } catch {
      throw new Error('Error creating user');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findOne({
        _id: id,
      });
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
      const deletedUser = await this.userModel.deleteOne({ _id: id });
      if (!deletedUser) {
        return 'User not found';
      }

      return 'User deleted successfully';
    } catch {
      return 'Error deleting user';
    }
  }
}
