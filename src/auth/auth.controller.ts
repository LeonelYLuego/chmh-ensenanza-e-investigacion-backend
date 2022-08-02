import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CurrentUserDto } from '@users/dtos';
import { API_ENDPOINTS } from 'utils/constants/api-routes.constant';
import { CurrentUser } from './auth.decorator';
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

  @Get(API_ENDPOINTS.AUTHENTICATION.LOGGED)
  @ApiBearerAuth()
  @ApiResponse({type: CurrentUserDto})
  async logged(@CurrentUser() currentUser: CurrentUserDto) {
    return currentUser;
  }
}
