import { IsDefined, IsNumber, Max, Min } from 'class-validator';

/** @Class Validates if a period is valid */
export class PeriodDto {
  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(3)
  period: number;
}
