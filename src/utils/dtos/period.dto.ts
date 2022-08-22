import { IsDefined, IsNumber, Max, Min } from 'class-validator';

export class PeriodDto {
  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(3)
  period: number;
}
