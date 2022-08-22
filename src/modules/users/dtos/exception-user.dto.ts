import { ApiProperty } from '@nestjs/swagger';
import { API_RESOURCES } from '@utils/constants/api-routes.constant';
import { ExceptionForbiddenDto } from 'utils/exceptions/exception.dto';

/** Create User forbidden exceptions */
export class ExceptionCreateUserDto extends ExceptionForbiddenDto {
  @ApiProperty({ type: String, enum: ['user already exists'] })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.USERS })
  path: string = API_RESOURCES.USERS;
}

/** Update User forbidden exceptions */
export class ExceptionUpdateUserDto extends ExceptionForbiddenDto {
  @ApiProperty({ type: String, enum: ['user not found', 'user not modified'] })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.USERS })
  path: string = API_RESOURCES.USERS;
}

/** Delete User forbidden exceptions */
export class ExceptionDeleteUserDto extends ExceptionForbiddenDto {
  @ApiProperty({
    type: String,
    enum: [
      'user not found',
      'user not deleted',
      'the current user can not be deleted',
    ],
  })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.USERS })
  path: string = API_RESOURCES.USERS;
}
