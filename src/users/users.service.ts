import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword = (password) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });
    return newUser;
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
    } catch (error) {
      return 'User not found';
    }
  }

  async findOneByUsername(username: string) {
    try {
      return this.userModel.findOne({
        email: username,
      });
    } catch (error) {
      return 'User not found';
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
    } catch (error) {
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
    } catch (error) {
      return 'Error deleting user';
    }
  }
}
