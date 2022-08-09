import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserDto } from '@users/dtos';
import { UsersService } from '@users/users.service';
import { LogInDto } from './dtos/log-in.dto';
import { ResponseLogInDto } from './dtos/response-log-in.dto';
import * as bcrypt from 'bcryptjs';

/** @class Authentication Service */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates if the User can log in
   * @async
   * @function validateUser
   * @param {LogInDto} logInDto The username and password of the user
   * @return {Promise<CurrentUserDto | null>} The logged User or Null if the user is not authorized
   */
  private async validateUser(
    logInDto: LogInDto,
  ): Promise<CurrentUserDto | null> {
    const user = await this.usersService.findOneByUsername(logInDto.username);
    if (user && bcrypt.compareSync(logInDto.password, user.password)) {
      return {
        _id: user._id,
        username: user.username,
        administrator: user.administrator,
      };
    }
    return null;
  }

  /**
   * Validates if the User con log in and return the User token
   * @async
   * @function login
   * @param {LogInDto} logInDto The username and password of the User
   * @returns {Promise<ResponseLogInDto>} The user and token log in
   */
  async login(logInDto: LogInDto): Promise<ResponseLogInDto> {
    const user = await this.validateUser(logInDto);
    if (user) {
      return {
        token: this.jwtService.sign(user),
        user,
      };
    }
    throw new UnauthorizedException();
  }

  /**
   * Gets the Current User of the provided token
   * @async
   * @function authenticate
   * @param {string} token The user's token
   * @returns {CurrentUser} The Current User of Null if the token is invalid
   */
  async authenticate(token: string): Promise<CurrentUserDto | null> {
    if (token) {
      try {
        const payload = await this.jwtService.verify(token);
        const user = await this.usersService.findOneByUsername(
          payload.username,
        );
        if (user) {
          return {
            _id: payload._id,
            username: payload.username,
            administrator: payload.administrator,
          };
        }
      } catch {
        return null;
      }
    }
    return null;
  }
}
