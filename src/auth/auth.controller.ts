import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUserDto } from '@users/dtos';
import {
  API_ENDPOINTS,
  API_RESOURCES,
} from '@utils/constants/api-routes.constant';
import { CurrentUser } from './auth.decorator';
import { AuthService } from './auth.service';
import { LogInDto } from './dtos/log-in.dto';
import { ResponseLogInDto } from './dtos/response-log-in.dto';

@ApiTags('Authentication')
@Controller(API_RESOURCES.AUTHENTICATION)
/** @class Authentication Controller */
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(API_ENDPOINTS.AUTHENTICATION.LOG_IN)
  @ApiOperation({ summary: '[All] Log in', description: 'Log to the `user`' })
  @ApiBody({ type: LogInDto, description: '`user` username and password' })
  @ApiUnauthorizedResponse({
    description: 'The `user` is not authorized to log in',
  })
  @ApiCreatedResponse({
    type: ResponseLogInDto,
    description: 'Returns the `user` and the `token`',
  })
  async login(@Body() logInDto: LogInDto): Promise<ResponseLogInDto> {
    return await this.authService.login(logInDto);
  }

  @Get(API_ENDPOINTS.AUTHENTICATION.LOGGED)
  @ApiOperation({
    summary: '[User] Get the Current User bases on the token',
    description:
      'Based on the `token` checks if the `token` is valid and returns the `user`',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'The `token` is invalid' })
  @ApiOkResponse({ type: CurrentUserDto, description: 'The Current `user`' })
  async logged(
    @CurrentUser() currentUser: CurrentUserDto,
  ): Promise<CurrentUserDto> {
    return currentUser;
  }
}
