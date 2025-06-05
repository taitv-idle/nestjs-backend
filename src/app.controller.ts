import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Public } from './auth/decorator/customize';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  handleHomePage() {
    console.log('Check port: ', this.configService.get<string>('PORT'));
    return this.appService.getHello();
  }
}
