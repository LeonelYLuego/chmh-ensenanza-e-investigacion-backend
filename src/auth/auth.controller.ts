import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { API_ENDPOINTS } from 'utils/constants/api-routes.constant';
import { AuthService } from './auth.service';
import { LogInDto } from './dtos/log-in.dto';

@Controller(API_ENDPOINTS.AUTHENTICATION.BASE_PATH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LogInDto })
  @Post(API_ENDPOINTS.AUTHENTICATION.LOG_IN)
  async login(@Body() logInDto: LogInDto) {
    return await this.authService.login(logInDto);
  }
}
