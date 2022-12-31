import { ApiProperty } from '@nestjs/swagger';

export class IncomingStudentIntervalDto {
  @ApiProperty()
  initialYear: number;

  @ApiProperty()
  finalYear: number;
}
