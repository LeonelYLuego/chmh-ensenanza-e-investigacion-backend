import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserDto } from '@users/dtos';
import { UsersService } from '@users/users.service';
import { LogInDto } from './dtos/log-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password === password) {
      return {
        _id: user._id,
        username: user.username,
        administrator: user.administrator,
      };
    }
    return null;
  }

  async login(logInDto: LogInDto) {
    const user = await this.validateUser(logInDto.username, logInDto.password);
    if (user) {
      return {
        token: this.jwtService.sign(user),
        user,
      };
    }
    throw new UnauthorizedException();
  }

  async authenticate(token: string): Promise<CurrentUserDto | null> {
    if (token) {
      try {
        const payload = await this.jwtService.verify(token);
        return {
          _id: payload._id,
          username: payload.username,
          administrator: payload.administrator,
        };
      } catch {
        return null;
      }
    }
    return null;
  }
}
