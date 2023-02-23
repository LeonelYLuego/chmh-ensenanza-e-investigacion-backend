import { ApiProperty } from '@nestjs/swagger';
import { IncomingStudent } from '..';

/** Incoming Students by Specialty data transfer object */
export class IncomingStudentsBySpecialtyDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  value: string;

  @ApiProperty({ type: [IncomingStudent] })
  incomingStudents: IncomingStudent[];
}
