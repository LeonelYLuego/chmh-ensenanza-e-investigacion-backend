import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/** Specialty data transfer object */
export class SpecialtyDto {
  @ApiProperty({ type: String })
  @IsDefined()
  @MinLength(3)
  @MaxLength(64)
  value: string;

  @ApiProperty({
    type: Number,
    description: 'Duration of the specialty in years',
    minimum: 1,
    maximum: 6,
    default: 3,
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  @Max(6)
  duration: number;

  @ApiProperty({ type: String })
  @IsDefined()
  @MinLength(3)
  @MaxLength(128)
  tenuredPostgraduateProfessor: string;
}
