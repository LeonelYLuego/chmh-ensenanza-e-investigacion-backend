import { IsDefined, IsNumber, Max, Min } from 'class-validator';

/** Validates a Year */
export class YearDto {
  @IsDefined()
  @IsNumber()
  @Max(2100)
  @Min(1990)
  year: number;
}
