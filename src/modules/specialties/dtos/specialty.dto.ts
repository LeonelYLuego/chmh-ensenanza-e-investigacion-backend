import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, MaxLength, MinLength } from "class-validator";

export class SpecialtyDto {
    @ApiProperty({type: String})
    @IsDefined()
    @MinLength(3)
    @MaxLength(64)
    value: string;
}