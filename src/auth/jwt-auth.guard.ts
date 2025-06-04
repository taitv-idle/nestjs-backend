// Guard kiểm tra xác thực JWT cho các route
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorator/customize';

// Đánh dấu đây là một guard có thể inject
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Inject Reflector để lấy metadata của route
  constructor(private reflector: Reflector) {
    super();
  }

  // Hàm kiểm tra xem route có public không, nếu có thì bỏ qua xác thực
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Nếu là public route thì cho phép truy cập
    }
    return super.canActivate(context); // Ngược lại kiểm tra xác thực JWT
  }

  // Xử lý kết quả xác thực, nếu không hợp lệ thì ném lỗi
  handleRequest(err, user, info) {
    // Có thể ném ra exception dựa vào info hoặc err
    if (err || !user) {
      throw err || new UnauthorizedException('Token is not valid'); // Token không hợp lệ
    }
    return user; // Trả về user nếu hợp lệ
  }
}
