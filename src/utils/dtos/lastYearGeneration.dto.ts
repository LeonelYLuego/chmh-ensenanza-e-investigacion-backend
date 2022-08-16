import { IsDefined, IsNumber, Max, Min } from "class-validator";

export class LastYearGenerationDto {
    @IsDefined()
    @IsNumber()
    @Max(2100)
    @Min(1990)
    lastYearGeneration: number;
}