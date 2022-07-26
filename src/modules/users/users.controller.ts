import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.shema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) : Promise<User> {
        return this.usersService.create(createUserDto);
    }
}
