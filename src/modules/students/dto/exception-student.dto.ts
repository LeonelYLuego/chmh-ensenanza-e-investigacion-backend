import { ApiProperty } from '@nestjs/swagger';
import { API_RESOURCES } from '@utils/constants/api-routes.constant';
import { ExceptionForbiddenDto } from '@utils/exceptions/exception.dto';

/** Update Student fobidden exceptions */
export class ExceptionUpdateStudentDto extends ExceptionForbiddenDto {
  @ApiProperty({
    type: String,
    enum: ['student not found', 'student not modified'],
  })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.STUDENTS })
  path: string = API_RESOURCES.STUDENTS;
}

/** Delete Student fobidden exceptions */
export class ExceptionDeleteStudentDto extends ExceptionForbiddenDto {
  @ApiProperty({
    type: String,
    enum: ['student not found', 'student not deleted'],
  })
  exception: string;

  @ApiProperty({ type: String, default: API_RESOURCES.STUDENTS })
  path: string = API_RESOURCES.STUDENTS;
}
