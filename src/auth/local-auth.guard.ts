// Guard xác thực local (username & password)
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Đánh dấu đây là một guard có thể inject
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
