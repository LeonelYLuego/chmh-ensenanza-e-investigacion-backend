import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserDto } from '@users/dtos';
import { API_ENDPOINTS, API_RESOURCES } from 'utils/constants/api-routes.constant';
import { CurrentUser } from './auth.decorator';
import { AuthService } from './auth.service';
import { LogInDto } from './dtos/log-in.dto';
import { ResponseLogInDto } from './dtos/response-log-in.dto';

@ApiTags('Authentication')
@Controller(API_RESOURCES.AUTHENTICATION)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LogInDto })
  @Post(API_ENDPOINTS.AUTHENTICATION.LOG_IN)
  @ApiOkResponse({type: ResponseLogInDto})
  async login(@Body() logInDto: LogInDto): Promise<ResponseLogInDto> {
    return await this.authService.login(logInDto);
  }

  @Get(API_ENDPOINTS.AUTHENTICATION.LOGGED)
  @ApiBearerAuth()
  @ApiOkResponse({type: CurrentUserDto})
  async logged(@CurrentUser() currentUser: CurrentUserDto): Promise<CurrentUserDto> {
    return currentUser;
  }
}
