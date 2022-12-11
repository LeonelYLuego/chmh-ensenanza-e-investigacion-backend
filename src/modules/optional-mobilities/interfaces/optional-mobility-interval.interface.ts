import { ApiProperty } from '@nestjs/swagger';

/** Optional Mobility Interval interface */
export class OptionalMobilityIntervalInterface {
  @ApiProperty()
  initialYear: number;

  @ApiProperty()
  finalYear: number;
}
