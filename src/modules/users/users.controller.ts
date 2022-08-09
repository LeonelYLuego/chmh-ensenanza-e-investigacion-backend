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
  UsePipes,
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
import {
  API_RESOURCES,
  DEFAULT_API_PATHS,
} from 'utils/constants/api-routes.constant';
import { ValidateIdPipe } from 'utils/pipes/validate-id.pipe';
import { CurrentUserDto, UpdateUserDto } from './dtos';
import { CreateUserDto } from './dtos/create-user.dto';
import { ExceptionUserAlreadyExistsDto } from './dtos/exception-user.dto';
import { User } from './user.schema';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller(API_RESOURCES.USERS)
/** @clas Users Controller */
export class UsersController {
  constructor(private usersService: UsersService) {}

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
  async find(@CurrentUser() currentUser: CurrentUserDto) {
    if (currentUser.administrator) {
      return this.usersService.find();
    } else throw new UnauthorizedException();
  }

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
    type: ExceptionUserAlreadyExistsDto,
    description: 'The `user.username` already exists in the database',
  })
  @ApiCreatedResponse({ type: User, description: 'Created `user`' })
  async create(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    if (currentUser.administrator) {
      return this.usersService.create(createUserDto);
    } else throw new UnauthorizedException();
  }

  @Put(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[Administrator] Update an User in the database',
    description:
      'Updates an `user` in the database based on the provided `_id` and returns de modified `user`',
  })
  @ApiParam({
    name: '_id',
    type: String,
    description: 'The `user` primary key',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  //It's missing the body and responses
  @UsePipes(ValidateIdPipe)
  async update(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('_id') _id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (currentUser.administrator) {
      return this.usersService.updateOne(_id, updateUserDto);
    } else throw new UnauthorizedException();
  }

  @Delete(DEFAULT_API_PATHS.BY_ID)
  @ApiOperation({
    summary: '[Administrator] Delete an User in the database',
    description:
      'Deletes an `user` in the database based on the provided `_id`',
  })
  @ApiParam({
    name: '_id',
    type: String,
    description: 'The `user` primary key',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Not authorized to perform the query',
  })
  //It's missing the body and responses
  @UsePipes(ValidateIdPipe)
  async delete(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('_id') _id: string,
  ): Promise<void> {
    if (currentUser.administrator) {
      await this.usersService.deleteOne(_id, currentUser);
    } else throw new UnauthorizedException();
  }
}
