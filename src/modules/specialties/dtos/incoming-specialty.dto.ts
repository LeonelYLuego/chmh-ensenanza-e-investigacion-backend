import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, MaxLength, MinLength } from 'class-validator';

/** Specialty data transfer object */
export class IncomingSpecialtyDto {
  @ApiProperty({ type: String })
  @IsDefined()
  @MinLength(3)
  @MaxLength(64)
  value: string;
}
