import { ApiProperty } from '@nestjs/swagger';
import { IncomingStudent } from '..';

export class IncomingStudentsBySpecialtyDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  value: string;

  @ApiProperty({ type: [IncomingStudent] })
  incomingStudents: IncomingStudent[];
}
