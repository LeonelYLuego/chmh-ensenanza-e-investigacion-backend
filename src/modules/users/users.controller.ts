import { CurrentUser } from '@auth/auth.decorator';
import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { API_RESOURCES } from 'utils/constants/api-routes.constant';
import { CurrentUserDto } from './dtos';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.schema';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller(API_RESOURCES.USERS)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({type: [User]})
  async find(@CurrentUser() currentUser: CurrentUserDto) {
    if(currentUser.administrator) {
      return this.usersService.find();
    } else throw new UnauthorizedException();
  }

  @Post()
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
