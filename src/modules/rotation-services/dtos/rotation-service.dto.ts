import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsMongoId,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RotationServiceDto {
  @ApiProperty({
    type: String,
    description: 'Rotation Service specialty _id',
  })
  @IsDefined()
  @IsMongoId()
  specialty: string;

  @ApiProperty({
    type: String,
    description: 'Rotation Service value',
    minLength: 3,
    maxLength: 128,
  })
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  value: string;
}
