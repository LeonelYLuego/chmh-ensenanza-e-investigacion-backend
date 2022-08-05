import { ApiProperty } from '@nestjs/swagger';
import { ExceptionForbbidenDto } from 'utils/exceptions/exception.dto';

/** @class Excpetion User Already Exists data transfer object */
export class ExceptionUserAlreadyExistsDto extends ExceptionForbbidenDto {
  @ApiProperty({ type: String, default: 'user already exists' })
  exception: 'user already extis';

  @ApiProperty({ type: String, default: '/users' })
  path: '/users';
}
