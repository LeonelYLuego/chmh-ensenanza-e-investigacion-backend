import { ApiProperty } from '@nestjs/swagger';

export class OptionalMobilityIntervalInterface {
  @ApiProperty()
  initialYear: number;

  @ApiProperty()
  finalYear: number;
}
