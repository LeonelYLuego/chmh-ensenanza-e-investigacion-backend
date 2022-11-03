import { ApiProperty } from '@nestjs/swagger';

export class FromYearToYearDto {
  @ApiProperty({ type: Number })
  initialYear: number;

  @ApiProperty({ type: Number })
  finalYear: number;
}
