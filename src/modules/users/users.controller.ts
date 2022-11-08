import { CurrentUser } from '@auth/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API_ENDPOINTS } from '@utils/constants';
import { HttpResponse } from '@utils/dtos';
import { ValidateIdPipe } from '@utils/pipes';
import { CreateUserDto, CurrentUserDto, UpdateUserDto } from './dtos';
import { User } from './user.schema';
import { UsersService } from './users.service';

/** Users Controller */
@ApiTags('Users')
@Controller(API_ENDPOINTS.USERS.BASE_PATH)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: '[Administrator] Add an User to the database',
    description: 'Creates an `user` in the database and returns the `user`',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto, description: '`user` data' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description: '`user already exists`',
  })
  @ApiCreatedResponse({ type: User, description: 'Created `user`' })
  async create(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() createUserDto: CreateUserDto,
  ): Promise<HttpResponse<User>> {
    if (currentUser.administrator) {
      return {
        data: await this.usersService.create(createUserDto),
      };
    } else throw new UnauthorizedException();
  }

  @Get()
  @ApiOperation({
    summary: '[Administrator] Get all Users in the database',
    description:
      'Finds in the database all `users` and return an array of `users` ',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiOkResponse({ type: [User], description: 'Array of `users`' })
  async find(
    @CurrentUser() currentUser: CurrentUserDto,
  ): Promise<HttpResponse<User[]>> {
    if (currentUser.administrator) {
      return {
        data: await this.usersService.findAll(),
      };
    } else throw new UnauthorizedException();
  }

  @Put(`:${API_ENDPOINTS.USERS.BY_ID}`)
  @ApiOperation({
    summary: '[Administrator] Update an User in the database',
    description:
      'Updates an `user` in the database based on the provided `_id` and returns the modified `user`',
  })
  @ApiParam({
    name: API_ENDPOINTS.USERS.BY_ID,
    type: String,
    description: 'The `user` primary key',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description: '`user not modified` `user not found`',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: User, description: 'The modified `user`' })
  async update(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param(API_ENDPOINTS.USERS.BY_ID, ValidateIdPipe) _id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<HttpResponse<User>> {
    if (currentUser.administrator) {
      return {
        data: await this.usersService.update(_id, updateUserDto),
      };
    } else throw new UnauthorizedException();
  }

  @Delete(`:${API_ENDPOINTS.USERS.BY_ID}`)
  @ApiOperation({
    summary: '[Administrator] Delete an User in the database',
    description:
      'Deletes an `user` in the database based on the provided `_id`',
  })
  @ApiParam({
    name: API_ENDPOINTS.USERS.BY_ID,
    type: String,
    description: 'The `user` primary key',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  @ApiForbiddenResponse({
    description:
      '`user not deleted` `the current user can not be deleted` `user not found`',
  })
  async delete(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param(API_ENDPOINTS.USERS.BY_ID, ValidateIdPipe) _id: string,
  ): Promise<HttpResponse<undefined>> {
    if (currentUser.administrator) {
      await this.usersService.delete(_id, currentUser);
      return {};
    } else throw new UnauthorizedException();
  }
}
