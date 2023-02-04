import { ApiProperty } from '@nestjs/swagger';

/** Obligatory Mobility interval data transfer object */
export class ObligatoryMobilityIntervalDto {
  @ApiProperty()
  initialYear: number;

  @ApiProperty()
  finalYear: number;
}
