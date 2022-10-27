import { IsDefined, IsNumber, Max, Min } from 'class-validator';

/** @Class Validates if a perido is valid */
export class PeriodDto {
  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(3)
  period: number;
}
