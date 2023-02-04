import { ApiProperty } from '@nestjs/swagger';

/** From year to year data transfer object */
export class FromYearToYearDto {
  @ApiProperty({ type: Number })
  initialYear: number;

  @ApiProperty({ type: Number })
  finalYear: number;
}
