import { ApiProperty } from '@nestjs/swagger';

/** Incoming Student Interval data transfer object */
export class IncomingStudentIntervalDto {
  @ApiProperty()
  initialYear: number;

  @ApiProperty()
  finalYear: number;
}
