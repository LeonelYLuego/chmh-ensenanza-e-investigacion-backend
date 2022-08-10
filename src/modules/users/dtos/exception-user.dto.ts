import { ApiProperty } from '@nestjs/swagger';
import { ExceptionForbiddenDto } from 'utils/exceptions/exception.dto';

/** @class Excpetion User Already Exists data transfer object */
export class ExceptionUserAlreadyExistsDto extends ExceptionForbiddenDto {
  @ApiProperty({ type: String, default: 'user already exists' })
  exception: 'user already extis';

  @ApiProperty({ type: String, default: '/users' })
  path: '/users';
}
