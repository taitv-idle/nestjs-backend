import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

// Service xử lý logic xác thực
@Injectable()
export class AuthService {
  // Inject UsersService và JwtService vào AuthService
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
  async login(user: any) {
    const payload = { username: user.email, sub: user._id }; // Tạo payload cho JWT
    return {
      access_token: this.jwtService.sign(payload), // Ký và trả về access_token
    };
  }
}
