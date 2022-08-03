import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  administrator?: boolean;
}
