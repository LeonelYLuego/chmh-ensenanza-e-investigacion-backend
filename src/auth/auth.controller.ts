import { Body, Controller, Get, Headers, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CurrentUser } from './auth.decorator';
import { AuthService } from './auth.service';
import { LogInDto } from './dtos/log-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LogInDto })
  @Post('login')
  async login(@Body() logInDto: LogInDto) {
    return await this.authService.login(logInDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() currentUser: any) {
    console.log(currentUser);
  }
}
