import { IsDefined, IsNumber, Max, Min } from 'class-validator';

/** @Class Validates if a year is valid */
export class YearDto {
  @IsDefined()
  @IsNumber()
  @Max(2100)
  @Min(1990)
  year: number;
}
