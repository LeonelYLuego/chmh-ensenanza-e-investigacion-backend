import { ApiProperty } from '@nestjs/swagger';

export class ObligatoryMobilityIntervalDto {
  @ApiProperty()
  initialYear: number;

  @ApiProperty()
  finalYear: number;
}
