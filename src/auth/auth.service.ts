import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

// Service xử lý logic xác thực
@Injectable()
export class AuthService {
  // Inject UsersService và JwtService vào AuthService
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Hàm kiểm tra thông tin đăng nhập của người dùng
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username); // Tìm user theo username
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password); // Kiểm tra mật khẩu
      if (isValid) {
        return user; // Trả về user nếu hợp lệ
      }
    }
    return null; // Trả về null nếu không hợp lệ
  }

  // Hàm đăng nhập, trả về access_token cho người dùng
  async login(user: IUser) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    const refreshToken = this.createRefreshToken(payload);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    try {
      // 1. Kiểm tra email đã tồn tại chưa
      const existingUser = await this.usersService.findOneByUsername(
        registerUserDto.email,
      );
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      // 2. Tạo user mới với role mặc định là 'USER'
      const userToCreate = {
        ...registerUserDto,
        role: 'USER',
        company: undefined,
      };

      const newUser = await this.usersService.create(userToCreate);

      // 3. Trả về thông tin user đã tạo (không bao gồm các trường thời gian)
      return newUser;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error?.message || 'Unknown error';
      throw new BadRequestException('Error registering user: ' + errorMessage);
    }
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
    });
    return refreshToken;
  };
}
