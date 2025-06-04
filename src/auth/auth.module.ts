// Module xác thực cho ứng dụng
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';

// Định nghĩa module AuthModule, cung cấp các dịch vụ xác thực
@Module({
  // Đăng ký các provider (dịch vụ) cho module
  providers: [AuthService, LocalStrategy, JwtStrategy],
  // Đăng ký các module cần thiết cho AuthModule
  imports: [
    UsersModule, // Module quản lý người dùng
    PassportModule, // Module hỗ trợ xác thực Passport
    JwtModule.registerAsync({ // Đăng ký module JWT với cấu hình động
      imports: [ConfigModule], // Sử dụng ConfigModule để lấy biến môi trường
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN'), // Lấy secret từ biến môi trường
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES'), // Lấy thời gian hết hạn token
        },
      }),
      inject: [ConfigService], // Inject ConfigService vào useFactory
    }),
  ],
  // Export AuthService để các module khác có thể sử dụng
  exports: [AuthService],
})
export class AuthModule {}
