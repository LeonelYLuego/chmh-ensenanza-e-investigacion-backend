import { IsDefined, IsNumber, Max, Min } from 'class-validator';

/** Validates a Year */
export class LastYearGenerationDto {
  @IsDefined()
  @IsNumber()
  @Max(2100)
  @Min(1990)
  lastYearGeneration: number;
}
